import { Router } from 'express';
import { createCustomer, getCustomers } from '../controllers/customerController';
import { authenticateToken } from '../middleware/authMiddleware'; // <--- Import et

const router = Router();

// Araya 'authenticateToken' koyduk
// Tüm müşteri işlemleri için kimlik doğrulama gerekli olacak
router.post('/', authenticateToken, createCustomer);
router.get('/', authenticateToken, getCustomers);
export default router;