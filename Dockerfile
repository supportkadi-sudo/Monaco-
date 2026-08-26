FROM node:22-alpine
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run media:sync \
 && npx prisma generate \
 && npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
