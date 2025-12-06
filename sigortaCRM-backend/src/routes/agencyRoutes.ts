import { Router } from 'express';
// createAgency, loginAgency vb. diğerleri kalsın...
// refreshToken YERİNE refreshUserToken import ediyoruz 👇
import {
    createAgency,
    loginAgency,
    refreshToken, // <--- YENİ İSİM
    logoutAgency,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerification // <--- BU ARTIK CONTROLLERDA VAR
} from '../controllers/agencyController';
import { authLimiter } from '../middleware/rateLimiter';


const router = Router();

router.post('/register', authLimiter, createAgency);
router.post('/login', authLimiter, loginAgency);
router.post('/resend-verification', authLimiter, resendVerification);

// İsim değişikliğini burada da yapıyoruz 👇
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutAgency);

router.post('/verify-email', verifyEmail);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

export default router;