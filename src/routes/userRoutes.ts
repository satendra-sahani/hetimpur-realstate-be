import express from 'express';
import { generatePaymentLink } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth';
import { getLands } from '../controllers/clientController';
const router = express.Router();

router.post('/razorpay/generate-payment-link',authMiddleware(["user","client"]), generatePaymentLink);
router.get('/lands', getLands);
export default router;
