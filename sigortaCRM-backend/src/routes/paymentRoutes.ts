import { Router } from 'express';
import { extendSubscriptionMock } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/authMiddleware';


const router = Router();

// Bu rotaya 'checkSubscription' KOYMA! Yoksa parası biten ödeme de yapamaz.
router.post('/mock-pay', authenticateToken, extendSubscriptionMock);

export default router;