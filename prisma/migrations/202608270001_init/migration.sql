CREATE TYPE "BookingStatus" AS ENUM ('NEW', 'CONTACTED', 'CONFIRMED', 'CANCELLED');

CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "telegram" TEXT,
    "visitDate" DATE NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'NEW',
    "adminNote" TEXT,
    "telegramMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BookingTelegramMessage" (
    "id" TEXT NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "chatId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BookingTelegramMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Booking_publicId_key" ON "Booking"("publicId");
CREATE INDEX "Booking_visitDate_idx" ON "Booking"("visitDate");
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE INDEX "Booking_phone_idx" ON "Booking"("phone");
CREATE INDEX "Booking_telegram_idx" ON "Booking"("telegram");
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");
CREATE UNIQUE INDEX "BookingTelegramMessage_chatId_messageId_key" ON "BookingTelegramMessage"("chatId", "messageId");
CREATE INDEX "BookingTelegramMessage_bookingId_idx" ON "BookingTelegramMessage"("bookingId");
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");
CREATE INDEX "AdminSession_userId_idx" ON "AdminSession"("userId");
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

ALTER TABLE "BookingTelegramMessage" ADD CONSTRAINT "BookingTelegramMessage_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
