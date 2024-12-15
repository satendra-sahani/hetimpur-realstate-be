import express from 'express';
import { uploadFileMultiple, uploadFileSingle } from '../controllers/imageController';
import { uploadFileWithoutSave } from '../utils/uploadFileWithoutSave';
import { callBackAfterPayment } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth';
const router = express.Router();

router.post("/upload",uploadFileWithoutSave(false),uploadFileSingle)
router.post("/upload-multiple",uploadFileWithoutSave(true),uploadFileMultiple);
router.post('/razorpay/callback',authMiddleware(["user","client"]), callBackAfterPayment);
export default router;
