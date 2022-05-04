import { Router } from 'express';
import CategoriaController from '../controllers/CategoriaController';
import limitRequests from '../middlewares/limitRequests';
import validate from '../middlewares/validate';
import { categoriaRules } from '../models/Categoria';
import verifyId from '../middlewares/verifyId';
import { verifyTokenAdmin } from '../middlewares/verifyToken';

const router = Router();

router.use(limitRequests.slightly);
router.use(verifyTokenAdmin);
router.post('/', validate(categoriaRules), CategoriaController.store);
router.get('/', CategoriaController.index);
router.get('/:id', verifyId, CategoriaController.show);
router.put('/:id', validate(categoriaRules), verifyId, CategoriaController.update);
router.delete('/:id', verifyId, CategoriaController.remove);

export default { router, name: '/categoria' };
