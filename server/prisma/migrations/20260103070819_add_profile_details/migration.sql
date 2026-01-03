-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "ifscCode" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "panNo" TEXT,
ADD COLUMN     "personalEmail" TEXT,
ADD COLUMN     "uanNo" TEXT;
