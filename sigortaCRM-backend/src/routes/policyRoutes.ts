import { Router } from 'express';
import { getPolicies, createPolicy, getPolicyById, updatePolicy, deletePolicy, getDashboardStats, getMonthlyStats } from '../controllers/policyController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireVerification } from '../middleware/verificationMiddleware';


const router = Router();

// TÜM POLİÇE İŞLEMLERİNDE KULLANICI DOĞRULAMASI GEREKİR
router.use(authenticateToken);
router.use(requireVerification); // Tüm rotalar için doğrulama gerektirir

// Poliçe Rotaları

router.get('/', getPolicies);
router.post('/', createPolicy);
router.get('/:id', getPolicyById);
router.put('/:id', updatePolicy);
router.delete('/:id', deletePolicy);

// Dashboard İstatistikleri
router.get('/dashboard', getDashboardStats);
router.get('/dashboard/monthly', getMonthlyStats);

export default router;