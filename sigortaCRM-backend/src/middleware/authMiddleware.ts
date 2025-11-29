import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // Authorization header'ını al
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearerdan sonra gelen kısmı alıyoruz yoksa undefined olur

    // Token yoksa 401 Unauthorized döneriz

    if (!token) {
        return res.status(401).json({ error: 'Giriş yapmanız gerekiyor (Token yok).' });
    }
    // Token'ı doğrula
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ error: 'Geçersiz Token.' });
        }

        // Token doğruysa, içindeki bilgiyi req.user'a yapıştırıyoruz.
        // user objesi şuna benzer: { id: '...', email: '...', iat: ..., exp: ... }
        (req as any).user = user;

        next(); // Sıradaki işleme geç
    });
};