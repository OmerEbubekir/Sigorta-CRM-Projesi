import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail, getVerificationHtml, getResetPasswordHtml } from '../lib/email';

// Acente Kayıt Fonksiyonu


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

export const loginAgency = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Kullanıcı var mı?
        const agency = await prisma.agency.findUnique({ where: { email } });
        if (!agency) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }

        // 2. Şifre doğru mu? (Hashlenmiş şifre ile girilen şifreyi kıyasla)
        const isValid = await bcrypt.compare(password, agency.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Hatalı şifre.' });
        }

        // 3. Token oluştur 
        const token = jwt.sign(
            { id: agency.id, email: agency.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' } // Token 1 saat geçerli olsun
        );

        res.json({ token, agency: { id: agency.id, name: agency.name } });

    } catch (error) {
        /// 4. Hata yönetimi
        console.error(error);
        res.status(500).json({ error: 'Giriş yapılamadı.' });
    }
};

export const resendVerification = async (req: Request, res: Response) => {
    const { email } = req.body;
    // Acenteyi bul
    const agency = await prisma.agency.findUnique({ where: { email } });
    // Kontroller
    if (!agency) return res.status(404).json({ error: 'Böyle bir kullanıcı bulunamadı.' });
    if (agency.isVerified) return res.status(400).json({ error: 'Hesabınız zaten doğrulanmış.' });

    // Yeni token üret ve kaydet (Eski linkin geçersiz olması için)
    const newVerificationToken = uuidv4();
    await prisma.agency.update({
        where: { id: agency.id },
        data: { verificationToken: newVerificationToken }
    });
    // Mail gönder
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${newVerificationToken}`;
    const html = getVerificationHtml(agency.name, link); // Yeni şablon
    await sendEmail(email, 'Hesap Doğrulama Tekrarı', html);

    res.json({ message: 'Doğrulama maili tekrar gönderildi.' });
};