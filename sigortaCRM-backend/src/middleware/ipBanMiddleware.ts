import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import redis from '../lib/redis'; // <--- Redis'i çağırdık

export const checkBannedIp = async (req: Request, res: Response, next: NextFunction) => {
    // IP'yi al
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';

    if (!clientIp) return next();

    // 1. ÖNCE REDIS'E SOR (Cache)
    // "banned:192.168.1.1" gibi bir anahtar arıyoruz
    const isBannedInRedis = await redis.get(`banned:${clientIp}`);

    if (isBannedInRedis) {
        console.log(`⛔ REDIS ENGELİ: ${clientIp}`);
        return res.status(403).json({ error: 'Erişiminiz engellenmiştir. (Cache)' });
    }

    // 2. REDIS'TE YOKSA VERİTABANINA SOR
    const banned = await prisma.bannedIp.findUnique({
        where: { ip: clientIp }
    });

    if (banned) {
        console.log(`⛔ VERİTABANI ENGELİ: ${clientIp}`);

        // 3. BULDUYSAN REDIS'E YAZ (Bir dahaki sefere veritabanını yorma)
        // 'EX', 60 * 60 * 24 -> 24 Saat boyunca Redis'te tut
        await redis.set(`banned:${clientIp}`, '1', 'EX', 60 * 60 * 24);

        return res.status(403).json({ error: 'Erişiminiz kalıcı olarak engellenmiştir.' });
    }

    next();
};