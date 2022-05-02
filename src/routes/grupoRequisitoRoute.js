import { Router } from 'express';
import GrupoRequisitoController from '../controllers/GrupoRequisitoController';
import limitRequests from '../middlewares/limitRequests';
import validate from '../middlewares/validate';
import { grupoReqRules } from '../models/GrupoRequisito';
import verifyId from '../middlewares/verifyId';
import { verifyTokenAdmin } from '../middlewares/verifyToken';

const router = Router();

router.use(limitRequests.slightly);
router.use(verifyTokenAdmin);
router.post('/', validate(grupoReqRules), GrupoRequisitoController.store);
router.get('/', GrupoRequisitoController.index);
router.get('/:id', verifyId, GrupoRequisitoController.show);
router.put('/:id', verifyId, GrupoRequisitoController.update);
router.delete('/:id', verifyId, GrupoRequisitoController.remove);

export default { router, name: '/gruporeq' };
