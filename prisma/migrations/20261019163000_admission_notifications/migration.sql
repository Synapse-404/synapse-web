CREATE TYPE "EmailNotificationState" AS ENUM ('PENDING', 'SENDING', 'SENT', 'FAILED');

CREATE TABLE "AdmissionEmailNotification" (
  "id" UUID NOT NULL,
  "statusEventId" UUID NOT NULL,
  "encryptedTrackingCode" VARCHAR(255),
  "state" "EmailNotificationState" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lockedUntil" TIMESTAMP(3),
  "providerMessageId" VARCHAR(120),
  "lastError" VARCHAR(250),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "sentAt" TIMESTAMP(3),
  CONSTRAINT "AdmissionEmailNotification_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AdmissionEmailNotification_statusEventId_key" ON "AdmissionEmailNotification"("statusEventId");
CREATE INDEX "AdmissionEmailNotification_state_nextAttemptAt_idx" ON "AdmissionEmailNotification"("state", "nextAttemptAt");
CREATE INDEX "AdmissionEmailNotification_state_lockedUntil_idx" ON "AdmissionEmailNotification"("state", "lockedUntil");
ALTER TABLE "AdmissionEmailNotification" ADD CONSTRAINT "AdmissionEmailNotification_statusEventId_fkey" FOREIGN KEY ("statusEventId") REFERENCES "AdmissionStatusEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
