import express from 'express';
import { createLand, deleteLand, getLands, updateLand } from '../controllers/clientController';
import { authMiddleware } from '../middleware/auth';
import { generatePaymentLink } from '../controllers/paymentController';

const router = express.Router();

router.post('/lands', createLand);
router.get('/lands', getLands);
router.put('/lands/:id', updateLand);
router.delete('/lands/:id', deleteLand);
router.post('/razorpay/generate-payment-link',authMiddleware(["user","client"]), generatePaymentLink);



export default router;
