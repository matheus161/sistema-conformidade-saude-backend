import { Gabarito } from "../models/Gabarito";
import { Categoria } from "../models/Categoria";
import { Modalidade } from "../models/Modalidade";
import { Requisito } from "../models/Requisito";

async function store(req, res) {
    try {
        const { categoria, modalidade, requisito } = req.body;

        // Checando se a categoria existe
        const categoriaExists = await Categoria.findById(categoria);
        if (!categoriaExists) {
            return res.status(404).json({ message: 'Categoria not found' });
        }

        // Checando se a modalidade já existe no banco
        const modalidadeExists = await Modalidade.findById(modalidade);
        if (!modalidadeExists) {
            return res.status(404).json({ message: 'Modalidade not found' });
        }

        //Checando se o requisito já existe no banco
        for (const item of requisito) {
            const requisitoExists = await Requisito.findById(item);
            if (!requisitoExists) {
                return res.status(404).json({ message: 'Requisito not found' });
            }
        }

        const gabarito = await Gabarito.create(req.body);

        return res.status(201).json(gabarito);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function index(req, res) {
    try {
        const gabaritos = await Gabarito.find().populate(['categoria', 'modalidade','requisito']);

        // Paginação
        const page = parseInt(req.query.page) || 0;

        const limit = 10;

        const startIndex = page * limit;

        const endIndex = (page + 1) * limit;

        const paginatedResults = gabaritos.slice(startIndex, endIndex);

        return res.status(201).json(paginatedResults);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function show(req, res) {
    try {
        const gabarito = await Gabarito.findById(req.params.id).populate(['categoria', 'modalidade','requisito']);
        if (!gabarito) {
            return res.status(404).json({ message: 'Gabarito not found' });
        }

        return res.status(201).json(gabarito);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function update(req, res) {
    try {
        const { categoria, modalidade, requisito, estagio } = req.body;

        // Checando se a categoria existe
        const gabarito = await Gabarito.findById(req.params.id);
        
        // Checando se a categoria existe
        if (categoria !== gabarito.categoria) {
            const categoriaExists = await Categoria.findById(categoria);
            if (!categoriaExists) {
                return res.status(404).json({ message: 'Categoria not found' });
            }
        }

        // Checando se a modalidade existe
        if (modalidade !== gabarito.modalidade) {
            const modalidadeExists = await Modalidade.findById(modalidade);
            if (!modalidadeExists) {
                return res.status(404).json({ message: 'Modalidade not found' });
            }
        }
        
        //Checando se o requisito passado é válido       
        for (let index = 0; index < requisito.length; index++) {
            if (requisito[index] !== gabarito.requisito[index]) {
                const requisitoExists = await Requisito.findById(requisito[index]);
                if (!requisitoExists) {
                    return res.status(404).json({ message: 'Requisito not found' });
                }
            }            
        }

        // Alterando os atributos manualmente
        gabarito.categoria = categoria || gabarito.categoria;
        gabarito.modalidade = modalidade || gabarito.modalidade;
        gabarito.requisito = requisito || gabarito.requisito;
        gabarito.estagio = estagio || gabarito.estagio;

        await gabarito.save();

        return res.status(200).json(gabarito);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function remove(req, res) {
    try {
       const gabaritoDeleted = await Gabarito.findByIdAndRemove(req.params.id);

       if(!gabaritoDeleted) {
        return res.status(404).json({ message: 'Gabarito not found' });
       }

       return res.status(200).json({ message: 'Gabarito deleted with sucsess' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default { store, index, show, update, remove };