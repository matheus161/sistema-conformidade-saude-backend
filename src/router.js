import path from 'path';
import { Router } from 'express';
import DirectoryUtils from './utils/DirectoryUtils';

async function createRouter() {
    const router = Router();

    const routesDirectory = path.join(__dirname, '/routes');
    const routes = await DirectoryUtils.getFilesInDirectory(routesDirectory, 'Route.js');

    routes.forEach(route => {
        router.use(route.name, route.router);
    });

    router.get('/', (req, res) => res.status(200).json({ message: 'Seja bem vindo!' }));

    return router;
}

export default createRouter;
