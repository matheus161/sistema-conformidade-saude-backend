import { User } from '../models/User';

function authorize(...roles) {
    return async (req, res, next) => {
        if (!req.userId) {
            return res.status(500).json({ message: 'Tentou autorizar, mas req.userId não estava definido.' });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: `Não foi encontrado usuário com o id ${req.userId}.` });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: `${user.role} não tem acesso a este recurso.` });
        }

        return next();
    };
}

export default authorize;
