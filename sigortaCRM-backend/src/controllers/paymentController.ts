import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// SİMÜLASYON: Sanki ödeme başarılı olmuş gibi süre uzatır
// src/controllers/paymentController.ts

export const extendSubscriptionMock = async (req: Request, res: Response) => {
    try {
        const agencyId = (req as any).user?.id;
        // Frontend'den gelen plan bilgisini al
        const { plan } = req.body as { plan: 'MONTHLY' | 'YEARLY' };

        if (!plan || (plan !== 'MONTHLY' && plan !== 'YEARLY')) {
            return res.status(400).json({ error: 'Geçerli bir plan seçmelisiniz.' });
        }

        // 1. Süre hesaplaması
        let daysToAdd = 30; // Varsayılan 30 gün (Aylık)
        let amount = 499.90;

        if (plan === 'YEARLY') {
            daysToAdd = 365; // Yıllık 365 gün
            amount = 4999.00; // Yıllık Fiyat
        }

        // 2. Mevcut kullanıcıyı bul
        const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
        if (!agency) return res.status(404).json({ error: "Kullanıcı yok" });

        // 3. Yeni Bitiş Tarihini Hesapla
        let newDate = new Date();
        // Eğer mevcut süre dolmadıysa, yeni süreyi mevcut sürenin bitişinden başlat
        if (agency.subscriptionEndDate > newDate) {
            newDate = new Date(agency.subscriptionEndDate);
        }

        // Süreyi ekle (PostgreSQL için düzgün çalışır)
        // Eğer SQLite kullanıyorsan, bu kısmı manuel olarak hesaplamamız gerekirdi, 
        // ancak sen Postgre'ye uygun formatı kullandığın için bu şekilde devam edebiliriz.
        newDate.setDate(newDate.getDate() + daysToAdd);

        // 4. Kaydet
        await prisma.agency.update({
            where: { id: agencyId },
            data: {
                subscriptionEndDate: newDate,
                subscriptionPlan: plan // Hangi planda olduğunu da kaydet
            }
        });

        // 5. Sahte ödeme kaydı
        await prisma.payment.create({
            data: {
                agencyId,
                amount: amount,
                paymentStatus: 'SUCCESS_MOCK',
                iyzicoPaymentId: `mock-id-${plan}-${Date.now()}`
            }
        });

        res.json({
            message: `${plan} Planı başarıyla eklendi! (Test Modu)`,
            newDate,
            plan
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'İşlem başarısız.' });
    }
};