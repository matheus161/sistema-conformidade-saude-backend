import { Types } from 'mongoose';

const { ObjectId } = Types;

async function verifyId(req, res, next) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Nenhum id fornecido.' });
    }

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: `${id} não é um id válido.` });
    }

    return next();
}

export default verifyId;
