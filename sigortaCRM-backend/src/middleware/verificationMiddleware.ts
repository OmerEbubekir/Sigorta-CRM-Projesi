import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const requireVerification = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Kullanıcıyı Bul
    const user = (req as any).user;
    const agencyId = user?.id;
    // 2. Kullanıcı Doğrulama Durumunu Kontrol Et
    if (!agencyId) {

        return res.status(401).json({ error: 'Yetkilendirme hatası.' });
    }
    // 3. Veritabanından Kullanıcı Bilgisini Al
    const agency = await prisma.agency.findUnique({
        where: { id: agencyId },
        select: { isVerified: true } // Sadece isVerified bilgisini çek
    });


    // 4. Doğrulama Durumunu Kontrol Et
    if (!agency || !agency.isVerified) {

        return res.status(403).json({ error: 'Lütfen önce e-posta adresinizi doğrulayın.' });
    }

    // 5. Doğrulanmış Kullanıcı İse İsteğe Devam Et
    next();
};