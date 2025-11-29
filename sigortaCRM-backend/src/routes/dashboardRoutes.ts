
import { Router } from 'express';
import { getDashboardStats, getMonthlyStats } from '../controllers/policyController'; // veya dashboardController
import { authenticateToken } from '../middleware/authMiddleware';
import { requireVerification } from '../middleware/verificationMiddleware';


const router = Router();

// 1. kimlik kontrolü
router.use(authenticateToken);

// 2. mail doğrulama kontrolü 
router.use(requireVerification);

// 3. Dashboard istatistikleri için rotalar
router.get('/', getDashboardStats);
router.get('/monthly', getMonthlyStats);

export default router;