-- CreateEnum
CREATE TYPE "PolicyType" AS ENUM ('POLICE', 'PORTFOY_DISI', 'ZEYIL');

-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'BIREYSEL',
    "name" TEXT NOT NULL,
    "taxId" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "relatedPolicyId" TEXT,
    "policyType" "PolicyType" NOT NULL DEFAULT 'POLICE',
    "company" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "seriesNo" TEXT,
    "plate" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "grossPrice" DECIMAL(10,2) NOT NULL,
    "netPrice" DECIMAL(10,2) NOT NULL,
    "status" "PolicyStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agency_email_key" ON "Agency"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_agencyId_taxId_key" ON "Customer"("agencyId", "taxId");

-- CreateIndex
CREATE INDEX "Policy_agencyId_idx" ON "Policy"("agencyId");

-- CreateIndex
CREATE INDEX "Policy_plate_idx" ON "Policy"("plate");

-- CreateIndex
CREATE INDEX "Policy_policyNumber_idx" ON "Policy"("policyNumber");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_relatedPolicyId_fkey" FOREIGN KEY ("relatedPolicyId") REFERENCES "Policy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
