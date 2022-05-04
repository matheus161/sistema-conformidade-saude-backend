import { Router } from 'express';
import ModalidadeController from '../controllers/ModalidadeController';
import limitRequests from '../middlewares/limitRequests';
import validate from '../middlewares/validate';
import { modalidadeRules } from '../models/Modalidade';
import verifyId from '../middlewares/verifyId';
import { verifyTokenAdmin } from '../middlewares/verifyToken';

const router = Router();

router.use(limitRequests.slightly);
router.use(verifyTokenAdmin);
router.post('/', validate(modalidadeRules), ModalidadeController.store);
router.get('/', ModalidadeController.index);
router.get('/:id', verifyId, ModalidadeController.show);
router.put('/:id', validate(modalidadeRules), verifyId, ModalidadeController.update);
router.delete('/:id', verifyId, ModalidadeController.remove);

export default { router, name: '/modalidade' };
