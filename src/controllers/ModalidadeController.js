import { Modalidade } from '../models/Modalidade';
import { Gabarito } from '../models/Gabarito';

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

        // Paginação
        const page = parseInt(req.query.page) || 0;

        const limit = 10;

        const startIndex = page * limit;

        const endIndex = (page + 1) * limit;

        const paginatedResults = modalidades.slice(startIndex, endIndex);

        var totalitens = modalidades.length;

        return res.status(201).json({paginatedResults, totalitens});
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function show(req, res) {
    try {
        const modalidade = await Modalidade.findById(req.params.id);
        if (!modalidade) {
            return res.status(404).json({ message: 'Modalidade not found' });
        }

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
        const modalidade = await Modalidade.findById(req.params.id);
        if (!modalidade) {
            return res.status(404).json({ message: 'Modalidade not found' });
        }

        const gabaritos = await Gabarito.find({modalidade:req.params.id});
        gabaritos.forEach(async (element) => {
            await element.remove();
        });

        await modalidade.remove();

        return res.status(200).json({ message: 'Modalidade deleted with sucsess' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default {
    store, index, show, update, remove
};
