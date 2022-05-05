import { Router } from 'express';
import RequisitoController from '../controllers/RequisitoController';
import limitRequests from '../middlewares/limitRequests';
import validate from '../middlewares/validate';
import { requisitoRules } from '../models/Requisito';
import verifyId from '../middlewares/verifyId';
import { verifyTokenAdmin } from '../middlewares/verifyToken';

const router = Router();

router.use(limitRequests.slightly);
router.use(verifyTokenAdmin);
router.post('/', validate(requisitoRules), RequisitoController.store);
router.get('/', RequisitoController.index);
router.get('/:id', verifyId, RequisitoController.show);
router.put('/:id', validate(requisitoRules), verifyId, RequisitoController.update);
router.delete('/:id', verifyId, RequisitoController.remove);

export default { router, name: '/requisito' };
