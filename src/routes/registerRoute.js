import { Router } from 'express';
import UserController from '../controllers/UserController';
import emailInUse from '../middlewares/emailInUse';
import limitRequests from '../middlewares/limitRequests';

const router = Router();

router.post('/',
    limitRequests.heavily,
    emailInUse,
    UserController.create
);

export default { router, name: '/register' };
