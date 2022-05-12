import { Router } from 'express';
import GabaritoController from '../controllers/GabaritoController';
import limitRequests from '../middlewares/limitRequests';
import validate from '../middlewares/validate';
import { gabaritoRules } from '../models/Gabarito';
import verifyId from '../middlewares/verifyId';
import { verifyTokenAdmin } from '../middlewares/verifyToken';

const router = Router();

router.use(limitRequests.slightly);

router.post('/', verifyTokenAdmin, validate(gabaritoRules), GabaritoController.store);
router.get('/', GabaritoController.index);
router.get('/:id', verifyId, GabaritoController.show);
router.put('/:id', verifyTokenAdmin, validate(gabaritoRules), verifyId, GabaritoController.update);
router.delete('/:id', verifyTokenAdmin, verifyId, GabaritoController.remove);

export default { router, name: '/gabarito' };