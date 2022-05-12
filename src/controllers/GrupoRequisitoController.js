import { GrupoRequisito } from '../models/GrupoRequisito';

async function store(req, res) {
    try {
        const { titulo } = req.body;

        // Checando se o grupo de requisito já existe no banco
        const grupoReqExists = await GrupoRequisito.findOne({ titulo });
        if (grupoReqExists) {
            return res.status(404).json({ message: 'Requisito already exists' });
        }

        const grupoReq = await GrupoRequisito.create(req.body);

        return res.status(201).json(grupoReq);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function index(req, res) {
    try {
        const gruposReq = await GrupoRequisito.find();

        // Paginação
        const page = parseInt(req.query.page) || 0;

        const limit = 10;

        const startIndex = page * limit;

        const endIndex = (page + 1) * limit;

        const paginatedResults = gruposReq.slice(startIndex, endIndex);

        return res.status(200).json(paginatedResults);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function show(req, res) {
    try {
        const grupoReq = await GrupoRequisito.findById(req.params.id);
        if (!grupoReq) {
            return res.status(404).json({ message: 'Grupo Requisito not found' });
        }

        return res.status(200).json(grupoReq);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function update(req, res) {
    try {
        const grupoReqUpdated = await GrupoRequisito.findByIdAndUpdate(req.params.id,
            req.body, { new: true });

        if (!grupoReqUpdated) {
            return res.status(404).json({ message: 'Grupo Requisito not found' });
        }

        await grupoReqUpdated.save();

        return res.status(200).json(grupoReqUpdated);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function remove(req, res) {
    try {
        const grupoReqDeleted = await GrupoRequisito.findByIdAndRemove(req.params.id);

        if (!grupoReqDeleted) {
            return res.status(404).json({ message: 'Grupo Requisito not found' });
        }

        return res.status(200).json({ message: 'Grupo Requisito deleted with sucsess' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default {
    store, index, show, update, remove
};
