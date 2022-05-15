import { Router } from 'express';
import UserController from '../controllers/UserController';
import limitRequests from '../middlewares/limitRequests';
import { verifyToken } from '../middlewares/verifyToken';
import validate from '../middlewares/validate';
import verifyId from '../middlewares/verifyId';
import { userRules } from '../models/User';

const router = Router();

router.use(limitRequests.slightly);

router.get('/', UserController.getAll); 
router.post('/', validate(userRules), UserController.create);
router.put('/resetpass', UserController.resetPassword);

router.use(verifyToken);

router.get('/show', UserController.getById);
router.patch('/changePass', UserController.changePassword);
router.put('/', UserController.update);
router.delete('/', UserController.remove);

export default { router, name: '/user' };
