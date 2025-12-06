import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// 1. TÜM ACENTELERİ LİSTELE
export const getAllAgencies = async (req: Request, res: Response) => {
    try {
        const agencies = await prisma.agency.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isVerified: true,
                createdAt: true,
                _count: { // İlişkili verilerin sayısını al (Kaç müşterisi, kaç poliçesi var?)
                    select: { policies: true, customers: true }
                }
            },
            orderBy: { createdAt: 'desc' } // En yeni kayıt en üstte
        });

        res.json(agencies);
    } catch (error) {
        res.status(500).json({ error: 'Acenteler çekilemedi.' });
    }
};

// 2. SİSTEM LOGLARINI LİSTELE
export const getSystemLogs = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.auditLog.findMany({
            include: {
                agency: { // Logu oluşturan acentenin adını da getir
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }, // En son olay en üstte
            take: 100 // Son 100 olayı getir (Sistemi yormamak için)
        });

        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Loglar çekilemedi.' });
    }
};

// Acente Durumunu Değiştir (Banla / Aç)
export const toggleAgencyStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // URL'den ID al (api/admin/agency/:id/toggle)

        // Mevcut durumu bul
        const agency = await prisma.agency.findUnique({ where: { id } });
        if (!agency) return res.status(404).json({ error: 'Acente bulunamadı.' });

        // Durumu tersine çevir (True -> False, False -> True)
        const newStatus = !agency.isBanned;

        await prisma.agency.update({
            where: { id },
            data: {
                isBanned: newStatus,
                currentRefreshToken: null // Eğer banlıyorsak, refresh token'ı sil ki yeni giriş yapamasın!
            }
        });

        const message = newStatus ? 'Acente aktif edildi.' : 'Acente engellendi ve oturumları kapatıldı.';
        res.json({ message, isBanned: newStatus });

    } catch (error) {
        res.status(500).json({ error: 'İşlem başarısız.' });
    }
};