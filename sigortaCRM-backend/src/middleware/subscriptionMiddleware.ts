import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const checkSubscription = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Kullanıcı ID'sini al
    const user = (req as any).user;
    const agencyId = user?.id;

    if (!agencyId) return res.status(401).json({ error: 'Yetkisiz erişim.' });

    // 2. Kullanıcının bitiş tarihini çek
    const agency = await prisma.agency.findUnique({
        where: { id: agencyId },
        select: { subscriptionEndDate: true }
    });

    if (!agency) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

    // 3. Kontrol: Bugünün tarihi > Bitiş Tarihi ise SÜRE BİTMİŞTİR
    const now = new Date();

    if (now > agency.subscriptionEndDate) {
        // 402 Payment Required (Ödeme Gerekli) standardı
        return res.status(402).json({
            error: 'Abonelik süreniz dolmuştur. Lütfen ödeme yapınız.',
            code: 'SUBSCRIPTION_EXPIRED' // Frontend bunu yakalayacak
        });
    }

    // 4. Süre varsa devam et
    next();
};