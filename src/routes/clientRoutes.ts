import express from 'express';
import { createLand, deleteLand, updateLand } from '../controllers/clientController';

const router = express.Router();

router.post('/lands', createLand);
router.put('/lands/:id', updateLand);
router.delete('/lands/:id', deleteLand);



export default router;
