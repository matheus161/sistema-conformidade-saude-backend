import { Router } from 'express';
import AvaliacaoController from '../controllers/AvaliacaoController';
import limitRequests from '../middlewares/limitRequests';
import validate from '../middlewares/validate';
import { avaliacaoRules, avaliacaoUpdateRules } from '../models/Avaliacao';
import verifyId from '../middlewares/verifyId';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.use(limitRequests.slightly);
router.use(verifyToken);

router.post('/', validate(avaliacaoRules), AvaliacaoController.store);
router.get('/', AvaliacaoController.index);
router.get('/:id', verifyId, AvaliacaoController.show);
router.put('/:index/:answer/:id', verifyId, AvaliacaoController.answer);
router.delete('/:id', verifyId, AvaliacaoController.remove);

export default { router, name: '/avaliacao' };