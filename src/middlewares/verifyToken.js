import jwt from 'jsonwebtoken';

function isMalformed(type, token) {
    if (!type || !token) {
        return true;
    }

    if (type !== 'Bearer') {
        return true;
    }

    return false;
}

async function verifyToken(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ message: 'Autenticação necessária.' });
    }

    const [type, token] = header.split(' ');

    if (isMalformed(type, token)) {
        return res.status(401).json({ message: 'Token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        req.userId = decoded.id;

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
}

export default verifyToken;
