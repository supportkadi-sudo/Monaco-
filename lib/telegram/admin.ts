export function isAuthorizedTelegramAdmin(
  chatId: string | undefined,
  userId: string | undefined,
  allowedAdminIds: ReadonlySet<string>
) {
  if (!chatId || !userId) return false;
  return chatId === userId && allowedAdminIds.has(userId);
}
