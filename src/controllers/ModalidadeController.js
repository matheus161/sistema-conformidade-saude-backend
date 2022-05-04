import { Modalidade } from '../models/Modalidade';

async function store(req, res) {
    try {
        const { tipo } = req.body;

        // Checando se a modalidade já existe no banco
        const modalidadeExists = await Modalidade.findOne({ tipo });
        if (modalidadeExists) {
            return res.status(404).json({ message: 'Modalidade already exists' });
        }

        const modalidade = await Modalidade.create(req.body);

        return res.status(201).json(modalidade);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function index(req, res) {
    try {
        const modalidades = await Modalidade.find();

        return res.status(201).json(modalidades);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function show(req, res) {
    try {
        const modalidade = await Modalidade.findById(req.params.id);

        return res.status(200).json(modalidade);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function update(req, res) {
    try {
        const { tipo } = req.body;

        const modalidade = await Modalidade.findById(req.params.id);

        // Checo se a modalidade que eu estou passando já existe no banco
        if (tipo !== modalidade.tipo) {
            const modalidadeExists = await Modalidade.findOne({ tipo });
            if (modalidadeExists) {
                return res.status(404).json({ message: 'Modalidade already exists' });
            }
        }

        modalidade.tipo = tipo || modalidade.tipo;
        await modalidade.save();

        return res.status(200).json(modalidade);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function remove(req, res) {
    try {
        const modalidadeDeleted = await Modalidade.findByIdAndRemove(req.params.id);

        if (!modalidadeDeleted) {
            return res.status(404).json({ message: 'Modalidade not found' });
        }

        return res.status(200).json({ message: 'Modalidade deleted with sucsess' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default {
    store, index, show, update, remove
};
