import nodemailer from 'nodemailer';

// Mail Ayarları
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// --- YARDIMCI HTML ŞABLON FONKSİYONLARI ---

// 1. Doğrulama Maili Şablonu
export const getVerificationHtml = (name: string, link: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px; border-top: 5px solid #3b82f6; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 15px;">Aramıza Hoşgeldin, ${name}!</h2>
        <p style="color: #555; line-height: 1.6;">Hesabınız başarıyla oluşturuldu. Ancak sistemimizi kullanmaya başlamadan önce, lütfen e-posta adresinizi doğrulayın.</p>
        <p style="color: #555; line-height: 1.6;">Bu, hesabınızın güvenliği için önemli bir adımdır.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #3b82f6; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Hesabımı Doğrula
            </a>
        </div>
        <p style="color: #777; font-size: 12px; margin-top: 20px;">Eğer bu bağlantıya tıklayamıyorsanız, lütfen aşağıdaki adresi kopyalayıp tarayıcınıza yapıştırın:</p>
        <p style="font-size: 12px; word-break: break-all; color: #3b82f6;">${link}</p>
    </div>
  </div>
`;

// 2. Şifre Sıfırlama Maili Şablonu
export const getResetPasswordHtml = (name: string, link: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px; border-top: 5px solid #ef4444; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 15px;">Şifre Sıfırlama İsteği</h2>
        <p style="color: #555; line-height: 1.6;">Merhaba ${name}, şifrenizi sıfırlama talebinizi aldık. Yeni bir şifre belirlemek için aşağıdaki düğmeye tıklayın:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #ef4444; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Yeni Şifre Belirle
            </a>
        </div>
        <p style="color: #777; font-size: 14px;">Bu bağlantı 1 saat içinde sona erecektir.</p>
        <p style="color: #777; font-size: 12px; margin-top: 20px;">Bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
    </div>
  </div>
`;

// Ana Mail Gönderme Fonksiyonu
export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        // Mail gönderimi
        const info = await transporter.sendMail({
            from: `"SigortaCRM" <${process.env.EMAIL_USER}>`,// Gönderen bilgisi
            to,// Alıcı
            subject,// Konu
            html, // HTML içeriği
        });
        console.log(`📧 Mail gönderildi: ${to} (Message ID: ${info.messageId})`);
    } catch (error) {
        console.error('Mail gönderme hatası:', error);
    }
};