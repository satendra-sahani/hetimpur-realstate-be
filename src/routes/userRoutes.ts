import express from 'express';
import { generatePaymentLink } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth';
const router = express.Router();

router.post('/razorpay/generate-payment-link',authMiddleware(["user","client"]), generatePaymentLink);

export default router;
