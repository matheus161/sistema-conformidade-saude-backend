import { Router } from 'express';
import LogController from '../controllers/LogController';

const router = Router();

router.get('/', LogController.get);

export default { router, name: '/log' };
