import { Router } from 'express';
import { getAllAgencies, getSystemLogs, toggleAgencyStatus } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';


const router = Router();

// ÇİFTE KORUMA: Önce giriş yapmış olmalı, Sonra Admin olmalı
router.use(authenticateToken);
router.use(requireAdmin);

// Rotalar
router.get('/agencies', getAllAgencies); // Tüm acenteler
router.get('/logs', getSystemLogs);      // Sistem logları
router.patch('/agency/:id/toggle', toggleAgencyStatus); // Acente durum değişikliği (Banla/Aç)
export default router;