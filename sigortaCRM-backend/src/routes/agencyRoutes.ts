import { Router } from 'express';
import { createAgency, forgotPassword, loginAgency, resendVerification, resetPassword, verifyEmail } from '../controllers/agencyController';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();
// Kayıt ve giriş işlemleri için rate limiter uygulanıyor
router.post('/register', authLimiter, createAgency);
router.post('/login', authLimiter, loginAgency);
router.post('/resend-verification', authLimiter, resendVerification);

// Mail doğrulama ve şifre sıfırlama işlemleri için rate limiter uygulanıyor
router.post('/verify-email', authLimiter, verifyEmail);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
export default router;