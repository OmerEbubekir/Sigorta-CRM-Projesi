-- AlterTable
ALTER TABLE "Agency" ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '7 days',
ADD COLUMN     "subscriptionPlan" TEXT NOT NULL DEFAULT 'TRIAL';

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "paymentStatus" TEXT NOT NULL,
    "iyzicoPaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
