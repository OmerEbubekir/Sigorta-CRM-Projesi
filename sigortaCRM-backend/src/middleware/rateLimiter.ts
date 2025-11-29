import rateLimit from 'express-rate-limit';

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
    windowMs: 15 * 60 * 1000, // 15 Dakika
    limit: 10, // Sadece 10 deneme hakkı!
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        error: "Çok fazla başarısız giriş denemesi. Güvenliğiniz için hesabınız 15 dakika kilitlendi."
    }
});