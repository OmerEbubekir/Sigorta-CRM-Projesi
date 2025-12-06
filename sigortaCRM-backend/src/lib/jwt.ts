import jwt from 'jsonwebtoken';
import redis from './redis';

// Tipi güncelleyelim: Artık role de zorunlu
interface UserPayload {
    id: string;
    email: string;
    role: string; // <--- YENİ
}
// Access Token üretimi
export const generateAccessToken = (user: UserPayload) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role // <--- TOKEN'IN İÇİNE GÖMÜYORUZ
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
    );
};

// Refresh Token üretimi (role yok)
export const generateRefreshToken = (user: { id: string; email: string }) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );
};

// Token'ı doğrula
export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
};

// Token'ı kara listeye ekle (blacklist)
export const blacklistToken = async (token: string) => {
    //Bu token'ı redis'te 15 dakika boyunca sakla (900 saniye)
    // Böylece 15 dakika boyunca geçersiz olur
    // Expiration süresi, access token'ın süresiyle aynı olmalı

    await redis.set(`blacklist:${token}`, 'true', 'EX', 900);
};