import { Router } from 'express';
import { AmanteController } from '../controllers/amante.controller.js';

const router = Router();
const controller = new AmanteController();

router.post('/amantes', controller.crear);
router.get('/amantes', controller.listar);

export default router;
