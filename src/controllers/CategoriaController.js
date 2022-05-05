import { Categoria } from '../models/Categoria';

async function store(req, res) {
    try {
        const { titulo } = req.body;

        // Checando se a categoria já existe no banco
        const categoriaExists = await Categoria.findOne({ titulo });
        if (categoriaExists) {
            return res.status(404).json({ message: 'Categoria already exists' });
        }

        const categoria = await Categoria.create(req.body);

        return res.status(201).json(categoria);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function index(req, res) {
    try {
        const categorias = await Categoria.find();

        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function show(req, res) {
    try {
        const categoria = await Categoria.findById(req.params.id);

        return res.status(200).json(categoria);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function update(req, res) {
    try {
        const { titulo } = req.body;

        const categoria = await Categoria.findById(req.params.id);

        // Checo se a categoria que eu estou passando já existe no banco
        if (titulo !== categoria.titulo) {
            const categoriaExists = await Categoria.findOne({ titulo });
            if (categoriaExists) {
                return res.status(404).json({ message: 'Categoria already exists' });
            }
        }

        categoria.titulo = titulo || categoria.titulo;

        await categoria.save();

        return res.status(200).json(categoria);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function remove(req, res) {
    try {
        const categoriaDeleted = await Categoria.findByIdAndRemove(req.params.id);

        if (!categoriaDeleted) {
            return res.status(404).json({ message: 'Categoria not found' });
        }

        return res.status(200).json({ message: 'Categoria deleted with sucsess' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default {
    store, index, show, update, remove
};
