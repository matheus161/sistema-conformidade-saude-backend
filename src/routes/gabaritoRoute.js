import { Router } from 'express';
import GabaritoController from '../controllers/GabaritoController';
import limitRequests from '../middlewares/limitRequests';
import validate from '../middlewares/validate';
import { gabaritoRules } from '../models/Gabarito';
import verifyId from '../middlewares/verifyId';
import { verifyTokenAdmin } from '../middlewares/verifyToken';

const router = Router();

router.use(limitRequests.slightly);
router.use(verifyTokenAdmin);

router.post('/', validate(gabaritoRules), GabaritoController.store);
router.get('/', GabaritoController.index);
router.get('/:id', verifyId, GabaritoController.show);
router.put('/:id', validate(gabaritoRules), verifyId, GabaritoController.update);
router.delete('/:id', verifyId, GabaritoController.remove);

export default { router, name: '/gabarito' };