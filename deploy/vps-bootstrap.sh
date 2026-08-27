#!/usr/bin/env bash
set -Eeuo pipefail

DOMAIN="monaco.kadi-store.uz"
APP_DIR="/opt/monaco"
REPO_URL="https://github.com/supportkadi-sudo/Monaco-.git"
BRANCH="feat/mvp"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo -i"
  exit 1
fi

for cmd in git docker openssl curl; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "Missing required command: $cmd"; exit 1; }
done

docker compose version >/dev/null 2>&1 || { echo "Docker Compose v2 is required"; exit 1; }

if [ ! -d "$APP_DIR/.git" ]; then
  git clone --branch "$BRANCH" --single-branch "$REPO_URL" "$APP_DIR"
else
  git -C "$APP_DIR" fetch origin "$BRANCH"
  git -C "$APP_DIR" checkout "$BRANCH"
  git -C "$APP_DIR" reset --hard "origin/$BRANCH"
fi

cd "$APP_DIR"

if [ ! -f .env ]; then
  POSTGRES_PASSWORD="$(openssl rand -hex 24)"

  read -r -p "Admin email: " ADMIN_EMAIL
  while [ -z "$ADMIN_EMAIL" ]; do read -r -p "Admin email is required: " ADMIN_EMAIL; done

  read -r -s -p "Admin password: " ADMIN_PASSWORD
  echo
  while [ -z "$ADMIN_PASSWORD" ]; do read -r -s -p "Admin password is required: " ADMIN_PASSWORD; echo; done

  read -r -s -p "Telegram bot token: " TELEGRAM_BOT_TOKEN
  echo
  while [ -z "$TELEGRAM_BOT_TOKEN" ]; do read -r -s -p "Telegram bot token is required: " TELEGRAM_BOT_TOKEN; echo; done

  read -r -p "Telegram admin chat IDs (comma separated): " TELEGRAM_ADMIN_CHAT_IDS
  while [ -z "$TELEGRAM_ADMIN_CHAT_IDS" ]; do read -r -p "At least one Telegram admin chat ID is required: " TELEGRAM_ADMIN_CHAT_IDS; done

  cat > .env <<EOF
POSTGRES_DB=monaco
POSTGRES_USER=monaco
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
DATABASE_URL=postgresql://monaco:${POSTGRES_PASSWORD}@db:5432/monaco?schema=public
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
TELEGRAM_ADMIN_CHAT_IDS=${TELEGRAM_ADMIN_CHAT_IDS}
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}
EOF
  chmod 600 .env
else
  echo ".env already exists; keeping existing secrets"
fi

echo "== Building containers =="
docker compose build --pull

echo "== Starting stack =="
docker compose up -d

for i in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:3000/api/health >/dev/null 2>&1; then
    break
  fi
  if [ "$i" -eq 30 ]; then
    docker compose ps
    docker compose logs --tail=120 web
    exit 1
  fi
  sleep 3
done

echo "== Seeding admin =="
docker compose exec -T web npm run db:seed

echo "== App health =="
curl -fsS http://127.0.0.1:3000/api/health && echo

echo "== Installing nginx/certbot if needed =="
if ! command -v nginx >/dev/null 2>&1 || ! command -v certbot >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update
    DEBIAN_FRONTEND=noninteractive apt-get install -y nginx certbot python3-certbot-nginx
  else
    echo "Install nginx + certbot manually, then re-run this script"
    exit 1
  fi
fi

cat > /etc/nginx/sites-available/${DOMAIN} <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    client_max_body_size 2m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
EOF

ln -sfn /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/${DOMAIN}
nginx -t
systemctl enable --now nginx

read -r -p "Email for Let's Encrypt: " LE_EMAIL
while [ -z "$LE_EMAIL" ]; do read -r -p "Let's Encrypt email is required: " LE_EMAIL; done

certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$LE_EMAIL" --redirect
nginx -t
systemctl reload nginx

echo
printf 'Deployment complete: https://%s\n' "$DOMAIN"
docker compose ps
