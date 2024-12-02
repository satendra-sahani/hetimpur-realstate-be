import express from 'express';
import { getUserList } from '../controllers/adminController';
const router = express.Router();
router.get("/users/:userType",getUserList);
export default router;
