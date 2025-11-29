import { PrismaClient } from '@prisma/client';

// Global bir Prisma istemcisi oluşturuyoruz
const prisma = new PrismaClient();

export default prisma;