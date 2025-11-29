import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

// 1. POLİÇE OLUŞTURMA
export const createPolicy = async (req: Request, res: Response) => {
    try {
        // Acente kimliği kullanıcıdan alınır
        const agencyId = (req as any).user?.id;
        const {
            customerId, productName, company, policyNumber, startDate, endDate,
            grossPrice, netPrice, plate, policyType,
            insuredName, insuredTaxId
        } = req.body;
        // Gerekli alanların kontrolü
        if (!agencyId || !customerId || !company || !policyNumber) {
            return res.status(400).json({ error: 'Eksik bilgi: Acente, Müşteri, Şirket ve Poliçe No zorunludur.' });
        }
        // Yeni poliçe oluşturma
        const newPolicy = await prisma.policy.create({
            data: {
                agencyId,
                customerId,
                productName,
                company,
                policyNumber,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                grossPrice,
                netPrice,
                plate,
                policyType,
                insuredName,
                insuredTaxId
            },
        });
        // Oluşturulan poliçeyi döndürme
        res.status(201).json(newPolicy);
    } catch (error) {
        // Hata durumunda loglama ve hata mesajı döndürme
        console.error(error);
        res.status(500).json({ error: 'Poliçe oluşturulurken hata çıktı.' });
    }
};

// 2. POLİÇELERİ LİSTELEME (FİLTRELEME & SAYFALAMA)
export const getPolicies = async (req: Request, res: Response) => {
    try {
        const agencyId = (req as any).user?.id;
        // Sorgu parametrelerini alma
        const {
            startDate, endDate, type, search, status,
            page = 1, limit = 10,
            sortBy = 'endDate', sortOrder = 'asc'
        } = req.query;
        // Dinamik where koşulu oluşturma
        const whereClause: Prisma.PolicyWhereInput = {
            agencyId: agencyId,
        };

        // Tarih Filtresi
        if (startDate || endDate) {
            whereClause.startDate = {};
            if (startDate) whereClause.startDate.gte = new Date(String(startDate));
            if (endDate) {
                const end = new Date(String(endDate));
                end.setHours(23, 59, 59, 999);
                whereClause.startDate.lte = end;
            }
        }
        // Tür ve Durum Filtresi
        if (type) whereClause.policyType = type as any;
        if (status) whereClause.status = status as any;
        // Arama Filtresi
        if (search) {
            whereClause.OR = [
                { policyNumber: { contains: String(search), mode: 'insensitive' } },
                { plate: { contains: String(search), mode: 'insensitive' } },
                { customer: { name: { contains: String(search), mode: 'insensitive' } } }
            ];
        }
        // Sayfalama ve Sıralama
        const pageNum = Number(page);
        const take = Number(limit);
        const skip = (pageNum - 1) * take;
        // Sıralama mantığı şu şekilde çalışır:
        // Eğer sortBy 'customer' ise, müşteri adına göre sıralama yapılır.
        // Aksi takdirde, belirtilen alan adına göre sıralama yapılır.
        let orderBy: any = {};
        if (String(sortBy) === 'customer') {
            orderBy = { customer: { name: String(sortOrder) } };
        } else {
            orderBy = { [String(sortBy)]: String(sortOrder) };
        }
        // Toplam kayıt sayısı ve poliçeleri alma
        const [totalCount, policies] = await prisma.$transaction([
            prisma.policy.count({ where: whereClause }),
            prisma.policy.findMany({
                where: whereClause,
                include: { customer: true },
                take: take,
                skip: skip,
                orderBy: [{ status: 'asc' }, orderBy],
            }),
        ]);
        // Kalan gün sayısını hesaplama
        const today = new Date();
        const formattedPolicies = policies.map((policy) => {
            const diffTime = new Date(policy.endDate).getTime() - today.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return { ...policy, daysLeft };
        });
        // Sonucu döndürme
        res.json({
            data: formattedPolicies,
            meta: {
                total: totalCount,
                page: pageNum,
                limit: take,
                totalPages: Math.ceil(totalCount / take)
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Poliçeler getirilemedi.' });
    }
};

// 3. TEKİL POLİÇE GETİR (ID İLE)
export const getPolicyById = async (req: Request, res: Response) => {
    try {
        // Poliçe ID'sini alma
        const { id } = req.params;
        const agencyId = (req as any).user?.id;
        // Poliçeyi veritabanından çekme
        const policy = await prisma.policy.findUnique({
            where: { id },
            include: { customer: true }
        });
        // Poliçe bulunamazsa 404 döndürme
        if (!policy) return res.status(404).json({ error: 'Poliçe bulunamadı.' });

        // Başka acentenin poliçesini görmemesi için kontrol
        if (policy.agencyId !== agencyId) {
            return res.status(403).json({ error: 'Yetkisiz erişim.' });
        }
        // Poliçeyi döndürme
        res.json(policy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Poliçe detayları alınamadı.' });
    }
};

// 4. POLİÇE GÜNCELLEME
export const updatePolicy = async (req: Request, res: Response) => {
    try {
        // Poliçe ID'sini alma
        const { id } = req.params;
        const agencyId = (req as any).user?.id;
        const data = req.body;
        // Mevcut poliçeyi kontrol etme
        const existingPolicy = await prisma.policy.findUnique({ where: { id } });
        // Poliçe var mı ve yetkili mi kontrolü
        if (!existingPolicy) return res.status(404).json({ error: 'Poliçe bulunamadı.' });
        if (existingPolicy.agencyId !== agencyId) return res.status(403).json({ error: 'Yetkiniz yok.' });
        // Tarih alanlarını Date tipine çevirme
        if (data.startDate) data.startDate = new Date(data.startDate);
        if (data.endDate) data.endDate = new Date(data.endDate);
        // Poliçeyi güncelleme
        const updatedPolicy = await prisma.policy.update({
            where: { id },
            data: data,
        });

        res.json(updatedPolicy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Güncelleme yapılamadı.' });
    }
};

// 5. POLİÇE SİLME
export const deletePolicy = async (req: Request, res: Response) => {
    try {
        // Poliçe ID'sini alma
        const { id } = req.params;
        const agencyId = (req as any).user?.id;
        // Mevcut poliçeyi kontrol etme
        const existingPolicy = await prisma.policy.findUnique({ where: { id } });
        // Poliçe var mı ve yetkili mi kontrolü
        if (!existingPolicy) return res.status(404).json({ error: 'Poliçe bulunamadı.' });
        if (existingPolicy.agencyId !== agencyId) return res.status(403).json({ error: 'Yetkiniz yok.' });

        await prisma.policy.delete({ where: { id } });

        res.json({ message: 'Poliçe başarıyla silindi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Silme işlemi başarısız.' });
    }
};

// 6. DASHBOARD İSTATİSTİKLERİ (TOPLAM) 
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // Acente kimliğini kullanıcıdan al
        const agencyId = (req as any).user?.id;
        const today = new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);

        // Paralel sorgular
        const [totalPolicies, totalCustomers, expiringSoon, totalRevenue] = await Promise.all([
            //Aktif poliçe sayısı
            prisma.policy.count({ where: { agencyId, status: 'ACTIVE' } }),
            // Toplam müşteri sayısı
            prisma.customer.count({ where: { agencyId } }),
            // Önümüzdeki 30 gün içinde sona erecek poliçeler
            prisma.policy.count({
                where: {
                    agencyId,
                    status: 'ACTIVE',
                    endDate: { gte: today, lte: next30Days },
                },
            }),
            // Toplam gelir
            prisma.policy.aggregate({
                where: { agencyId, status: 'ACTIVE' },
                _sum: { netPrice: true },
            }),
        ]);

        res.json({
            totalPolicies,
            totalCustomers,
            expiringSoon,
            totalRevenue: totalRevenue._sum.netPrice || 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'İstatistikler alınamadı.' });
    }
};

// 7. AYLIK İSTATİSTİKLER (DÖNEMSEL) 
export const getMonthlyStats = async (req: Request, res: Response) => {
    try {
        const agencyId = (req as any).user?.id;
        const { month, year } = req.query;
        // Ay ve Yıl kontrolü
        if (!month || !year) {
            return res.status(400).json({ error: 'Ay ve Yıl seçilmelidir.' });
        }
        // Seçilen ay ve yılı sayıya çevir
        const selectedYear = Number(year);
        const selectedMonth = Number(month);

        // Ayın başı ve sonunu hesapla
        const startDate = new Date(selectedYear, selectedMonth - 1, 1);
        const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

        const result = await prisma.policy.aggregate({
            where: {
                agencyId,
                startDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _count: { id: true },
            _sum: { netPrice: true },
        });

        res.json({
            count: result._count.id,
            revenue: result._sum.netPrice || 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Aylık veri alınamadı.' });
    }
};