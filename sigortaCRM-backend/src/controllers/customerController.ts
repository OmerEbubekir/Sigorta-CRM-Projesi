import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createCustomer = async (req: Request, res: Response) => {
    try {
        // Frontend'den gelen veriler
        const { name, taxId, type, phone, email } = req.body;
        const agencyId = req.user?.id; // Middleware'den gelen acente ID'si
        // Basit doğrulama
        if (!agencyId || !name) {
            return res.status(400).json({ error: 'Acente ID ve İsim zorunludur.' });
        }

        // Veritabanına kaydet
        const newCustomer = await prisma.customer.create({
            data: {
                agencyId, // Hangi acentenin müşterisi?
                name,
                taxId,
                type,     // BIREYSEL veya KURUMSAL
                phone,
                email
            },
        });

        res.status(201).json(newCustomer);
    } catch (error: any) {
        // Eğer aynı acente, aynı TC ile kayıt yapmaya çalışırsa hata döner
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Bu müşteri zaten kayıtlı (TC/Vergi No çakışması).' });
        }
        // Diğer hatalar için genel hata mesajı
        console.error(error);
        res.status(500).json({ error: 'Müşteri oluşturulamadı.' });
    }
};

export const getCustomers = async (req: Request, res: Response) => {
    try {
        const agencyId = (req as any).user?.id;

        // Acentenin tüm müşterilerini getir (İsme göre sıralı)
        const customers = await prisma.customer.findMany({
            where: { agencyId },
            orderBy: { name: 'asc' },
        });

        res.json(customers);
    } catch (error) {
        // Hata durumunda genel hata mesajı
        console.error(error);
        res.status(500).json({ error: 'Müşteriler getirilemedi.' });
    }
};