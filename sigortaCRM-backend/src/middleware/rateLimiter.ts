import rateLimit from 'express-rate-limit';
import prisma from '../lib/prisma';
import redis from '../lib/redis';

// 1. GENEL KORUMA (Tüm API için)
// 15 dakika içinde bir IP adresinden en fazla 100 istek gelebilir.
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Dakika
    limit: 100, // İstek sayısı sınırı
    standardHeaders: 'draft-7', // Hız sınırı bilgisini header'da gönder (X-RateLimit-Limit vb.)
    legacyHeaders: false, // Eski başlıkları (X-RateLimit-Remaining) devre dışı bırak
    message: {
        error: "Çok fazla istek gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin."
    }
});

// 2. GİRİŞ/KAYIT KORUMASI 
// 15 dakika içinde bir IP adresinden en fazla 10 Hatalı Giriş/Kayıt denemesi yapılabilir.
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Dakika içinde
    limit: 10, // 10 kere denerse
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // Handler'ı sildik! Artık kalıcı ban yok.
    message: {
        error: "Çok fazla başarısız giriş denemesi. Güvenliğiniz için 15 dakika beklemelisiniz."
    }
});