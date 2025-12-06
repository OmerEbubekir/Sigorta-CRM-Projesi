import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Kullanıcı ID'sini al (Auth middleware'den geliyor)
    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli.' });
    }

    // 2. Veritabanından rolünü kontrol et
    const agency = await prisma.agency.findUnique({
      where: { id: user.id },
      select: { role: true } // Sadece rolü çek, gerisi lazım değil
    });

    // 3. Admin değilse kapıdan çevir
    if (!agency || agency.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Bu alana sadece Yöneticiler girebilir! 🚫' });
    }

    // 4. Admisse geç
    next();

  } catch (error) {
    console.error('Admin kontrol hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
};