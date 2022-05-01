import { Router } from 'express';
import UserController from '../controllers/UserController';
import emailInUse from '../middlewares/emailInUse';
import validateUser from '../middlewares/validateUser';
import roleValidators from '../utils/RoleValidationUtils';
import limitRequests from '../middlewares/limitRequests';

const router = Router();

router.post('/',
    limitRequests.heavily,
    validateUser(roleValidators),
    emailInUse,
    UserController.create
);

export default { router, name: '/register' };
