const telegramHandle = /^@[A-Za-z0-9_]{5,32}$/;

export function telegramProfileUrl(value: string | null | undefined) {
  if (!value || !telegramHandle.test(value)) return null;
  return `https://t.me/${value.slice(1)}`;
}
