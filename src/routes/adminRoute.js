import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import limitRequests from '../middlewares/limitRequests';
import validate from '../middlewares/validate';
import { adminRules } from '../models/Admin';
import verifyId from '../middlewares/verifyId';
import { verifyTokenAdmin } from '../middlewares/verifyToken';

const router = Router();

router.use(limitRequests.slightly);
router.put('/resetpass', AdminController.resetPassword);
router.use(verifyTokenAdmin);
router.post('/', validate(adminRules), AdminController.store);
router.get('/', AdminController.index);
router.get('/:id', verifyId, AdminController.show);
router.put('/', AdminController.update);
router.delete('/', AdminController.remove);
router.patch('/changePass', AdminController.changePassword);

export default { router, name: '/admin' };
