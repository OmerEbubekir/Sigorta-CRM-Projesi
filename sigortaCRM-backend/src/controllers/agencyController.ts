import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail, getVerificationHtml, getResetPasswordHtml } from '../lib/email';
import { blacklistToken, generateAccessToken, generateRefreshToken, verifyToken } from '../lib/jwt';



// 1. REGISTER
export const createAgency = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        // Zaten kayıtlı mı?

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4(); // Doğrulama tokenı oluştur

        const newAgency = await prisma.agency.create({
            data: {
                name, email, password: hashedPassword,
                verificationToken, // Tokenı kaydet
                isVerified: false  // Henüz doğrulanmadı
            },
        });

        // Mail Gönderme (Doğrulama linki ile)
        const link = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const html = getVerificationHtml(name, link);
        await sendEmail(email, 'Hesabınızı Doğrulayın', html);

        res.status(201).json({ message: 'Kayıt başarılı! Lütfen mail kutunuzu kontrol edin.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Kayıt işlemi başarısız oldu.' });
    }
};

// 2. MAİL DOĞRULAMA 
export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.body;
    // Tokena sahip acenteyi bul
    const agency = await prisma.agency.findFirst({ where: { verificationToken: token } });

    if (!agency) return res.status(400).json({ error: 'Geçersiz token.' });

    await prisma.agency.update({
        where: { id: agency.id },
        data: { isVerified: true, verificationToken: null } // Tokenı temizle
    });

    res.json({ message: 'Hesap başarıyla doğrulandı!' });
};

// 3. ŞİFREMİ UNUTTUM 
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const agency = await prisma.agency.findUnique({ where: { email } });
    // Acente var mı?
    if (!agency) return res.status(404).json({ error: 'Bu mail adresiyle kayıtlı kullanıcı yok.' });

    const resetToken = uuidv4();
    // Token 1 saat geçerli 
    const expires = new Date(Date.now() + 3600000);
    // Tokenı ve süresini kaydet
    await prisma.agency.update({
        where: { id: agency.id },
        data: { resetPasswordToken: resetToken, resetPasswordExpires: expires }
    });
    // Mail gönder
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = getResetPasswordHtml(agency.name, link);
    await sendEmail(email, 'Şifre Sıfırlama', html);

    res.json({ message: 'Sıfırlama linki mail adresinize gönderildi.' });
};

// 4. ŞİFRE SIFIRLAMA 
export const resetPassword = async (req: Request, res: Response) => {
    // Token ve yeni şifreyi al
    const { token, newPassword } = req.body;
    // Tokena sahip acenteyi bul
    const agency = await prisma.agency.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { gt: new Date() } // Süresi dolmamış
        }
    });
    // Acente var mı?
    if (!agency) return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş link.' });
    // Şifreyi güncelle
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Tokenı ve süresini temizle
    await prisma.agency.update({
        where: { id: agency.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }
    });

    res.json({ message: 'Şifreniz başarıyla değiştirildi. Giriş yapabilirsiniz.' });
};

// LOGIN GÜNCELLEMESİ
export const loginAgency = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const agency = await prisma.agency.findUnique({ where: { email } });
        if (!agency) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

        const isValid = await bcrypt.compare(password, agency.password);
        if (!isValid) return res.status(401).json({ error: 'Hatalı şifre.' });

        // İKİ TOKEN ÜRETİYORUZ
        const accessToken = generateAccessToken({
            id: agency.id,
            email: agency.email,
            role: agency.role // <--- EKLENDİ (Artık token içinde bu bilgi var)
        });
        const refreshToken = generateRefreshToken({ id: agency.id, email: agency.email });

        // Refresh Token'ı veritabanına kaydet (Güvenlik için şart)
        await prisma.agency.update({
            where: { id: agency.id },
            data: { currentRefreshToken: refreshToken }
        });

        // İkisini de kullanıcıya gönder
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // JavaScript okuyamasın (XSS Koruması)
            secure: process.env.NODE_ENV === 'production', // Sadece HTTPS'de çalışsın (Canlıda)
            sameSite: 'strict', // CSRF koruması
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Gün (Milisaniye)
        });

        res.json({
            accessToken,
            agency: {
                id: agency.id,
                name: agency.name,
                role: agency.role,
                email: agency.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Giriş yapılamadı.' });
    }
};



// ÇIKIŞ YAPMA (LOGOUT) - 
// TOKEN YENİLEME (REFRESH)
export const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({ error: 'Token gerekli.' });

    try {
        // 1. Token geçerli mi? (İmza kontrolü)
        const payload = verifyToken(token) as any;

        // 2. Veritabanındaki ile eşleşiyor mu? (Çalınma kontrolü)
        const agency = await prisma.agency.findUnique({ where: { id: payload.id } });

        if (!agency || agency.currentRefreshToken !== token) {
            return res.status(403).json({ error: 'Geçersiz veya süresi dolmuş oturum.' });
        }

        // 3. Her şey temizse, YENİ BİR Access Token ver
        const newAccessToken = generateAccessToken({
            id: agency.id, email: agency.email,
            role: agency.role
        });

        // (Opsiyonel: Refresh token da yenilenebilir (Rotation), ama şimdilik sabit kalsın)

        res.json({ accessToken: newAccessToken });

    } catch (error) {
        return res.status(403).json({ error: 'Geçersiz token.' });
    }
};

// ÇIKIŞ YAPMA (LOGOUT) - Token'ı veritabanından siler
export const logoutAgency = async (req: Request, res: Response) => {
    const { id } = req.body; // Veya middleware'den alabiliriz

    const autHeader = req.headers['authorization'];
    const token = autHeader && autHeader.split(' ')[1];//bearer kısmını atıyoruz
    //
    if (token) {
        await blacklistToken(token);
    }
    if (id) {
        await prisma.agency.update({
            where: { id },
            data: { currentRefreshToken: null }

        });
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Başarıyla çıkış yapıldı.' });



};

export const resendVerification = async (req: Request, res: Response) => {
    const { email } = req.body;

    const agency = await prisma.agency.findUnique({ where: { email } });

    if (!agency) return res.status(404).json({ error: 'Böyle bir kullanıcı bulunamadı.' });
    if (agency.isVerified) return res.status(400).json({ error: 'Hesabınız zaten doğrulanmış.' });

    // Yeni token üret
    const newVerificationToken = uuidv4();
    await prisma.agency.update({
        where: { id: agency.id },
        data: { verificationToken: newVerificationToken }
    });

    // Mail at (Burada import ettiğin fonksiyonları kullandığına emin ol)
    // Eğer import hatası alırsan dosyanın en üstüne: 
    // import { getVerificationHtml, sendEmail } from '../lib/email'; eklemeyi unutma.

    const link = `${process.env.FRONTEND_URL}/verify-email?token=${newVerificationToken}`;

    // Eğer getVerificationHtml yoksa basit html kullan, varsa onu kullan
    // const html = getVerificationHtml(agency.name, link); 
    const html = `<h1>Doğrulama Linki</h1><a href="${link}">Tıkla</a>`;

    await sendEmail(email, 'Hesap Doğrulama Tekrarı', html);

    res.json({ message: 'Doğrulama maili tekrar gönderildi.' });
};