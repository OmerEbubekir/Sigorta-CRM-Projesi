import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const agencyId = (req as any).user?.id;

        // Tarih hesaplamaları
        const today = new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30); // Bugünden 30 gün sonrası

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Ayın 1'i
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Ayın sonu

        // Tüm sorguları PARALEL (aynı anda) çalıştırıyoruz
        const [totalPolicies, totalCustomers, expiringSoon, totalRevenue] = await Promise.all([

            // 1. Toplam Aktif Poliçe Sayısı
            prisma.policy.count({
                where: { agencyId, status: 'ACTIVE' },
            }),

            // 2. Toplam Müşteri Sayısı
            prisma.customer.count({
                where: { agencyId },
            }),

            // 3. Yaklaşan Bitişler (Önümüzdeki 30 gün içinde bitecek aktif poliçeler)
            prisma.policy.count({
                where: {
                    agencyId,
                    status: 'ACTIVE',
                    endDate: {
                        gte: today,      // Bugünden büyük
                        lte: next30Days, // 30 gün sonrasından küçük
                    },
                },
            }),

            // 4. Finansal Özet (Toplam Net Prim Cirosu)
            prisma.policy.aggregate({
                where: { agencyId, status: 'ACTIVE' },
                _sum: {
                    netPrice: true, // Net fiyatları topla
                },
            }),
        ]);

        // Sonuçları dön 
        res.json({
            totalPolicies,
            totalCustomers,
            expiringSoon,
            totalRevenue: totalRevenue._sum.netPrice || 0, // Eğer hiç poliçe yoksa 0 dön
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'İstatistikler alınamadı.' });
    }
};

//Aylık kazanc
export const getMonthlyStats = async (req: Request, res: Response) => {
    try {
        const agencyId = (req as any).user?.id;
        // Query'den ay ve yılı al (Örn: ?month=12&year=2025)
        const { month, year } = req.query;
        // Ay ve yılın sağlandığından emin ol
        if (!month || !year) {
            return res.status(400).json({ error: 'Ay ve Yıl seçilmelidir.' });
        }

        // Seçilen ayın başlangıç ve bitiş tarihlerini bul
        const selectedYear = Number(year);
        const selectedMonth = Number(month); // 1 (Ocak) - 12 (Aralık)

        // JavaScript'te aylar 0'dan başlar (0=Ocak), o yüzden -1 yapıyoruz
        const startDate = new Date(selectedYear, selectedMonth - 1, 1);
        const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59); // Ayın son günü

        // Veritabanına sor: "Bu tarih aralığındaki poliçeleri topla"
        const result = await prisma.policy.aggregate({
            where: {
                agencyId,
                startDate: {
                    gte: startDate,
                    lte: endDate,
                },
                // Bütün poliçeleri getiririp o ayda başlayanları sayıyoruz
                // Eğer sadece aktif poliçeleri saymak isterseniz, aşağıdaki satırı ekleyebilirsiniz:
                // status: 'ACTIVE', 
            },
            _count: {
                id: true, // Kaç adet?
            },
            _sum: {
                netPrice: true, // Toplam para ne?
            },
        });
        // Sonuçları dön
        res.json({
            count: result._count.id,
            revenue: result._sum.netPrice || 0,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Aylık veri alınamadı.' });
    }
};