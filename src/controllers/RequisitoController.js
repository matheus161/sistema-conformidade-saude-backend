import { Requisito } from '../models/Requisito';
import { GrupoRequisito } from '../models/GrupoRequisito';
import { Gabarito } from '../models/Gabarito';

async function store(req, res) {
    try {
        const { grupoRequisito, nameId } = req.body;

        // Checando se o requisito já existe no banco
        const requisitoExists = await Requisito.findOne({ nameId });
        if (requisitoExists) {
            return res.status(404).json({ message: 'Requisito already exists' });
        }

        // Checando se ele passou um Grupo de Requisitos valido
        const grupoReqExists = await GrupoRequisito.findById(grupoRequisito);
        if (!grupoReqExists) {
            return res.status(404).json({ message: 'Grupo Requisito not valid' });
        }

        const requisito = await Requisito.create(req.body);

        return res.status(201).json(requisito);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function index(req, res) {
    try {
        const requisitos = await Requisito.find().populate('grupoRequisito'); // Popular essa rota

        // Paginação
        const page = parseInt(req.query.page) || 0;

        const limit = 10;

        const startIndex = page * limit;

        const endIndex = (page + 1) * limit;

        const paginatedResults = requisitos.slice(startIndex, endIndex);

        return res.status(200).json(paginatedResults);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function show(req, res) {
    try {
        const requisito = await Requisito.findById(req.params.id).populate('grupoRequisito');
        if (!requisito) {
            return res.status(404).json({ message: 'Requisito not found' });
        }

        return res.status(200).json(requisito);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function update(req, res) {
    try {
        const { nameId, grupoRequisito } = req.body;
        const requisito = await Requisito.findById(req.params.id);

        // Checo se o nome de requisito que eu estou passando já existe no banco
        if (nameId !== requisito.nameId) {
            const requisitoExists = await Requisito.findOne({ nameId });
            if (requisitoExists) {
                return res.status(404).json({ message: 'Requisito already exists' });
            }
        }

        // Checo de o grupo de Requisito é valido
        if (grupoRequisito !== requisito.grupoRequisito) {
            const grupoReqExists = await GrupoRequisito.findById(grupoRequisito);
            if (!grupoReqExists) {
                return res.status(404).json({ message: 'Grupo Requisito not valid' });
            }
        }

        // Alterando os atributos manualmente
        requisito.nameId = req.body.nameId || requisito.nameId;
        requisito.titulo = req.body.titulo || requisito.titulo;
        requisito.descricao = req.body.descricao || requisito.descricao;
        requisito.grupoRequisito = req.body.grupoRequisito || requisito.grupoRequisito;

        await requisito.save();

        return res.status(200).json(requisito);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function remove(req, res) {
    try {
        const requisito = await Requisito.findById(req.params.id);
        if (!requisito) {
            return res.status(404).json({ message: 'Requisito not found' });
        }
        const gabaritos = await Gabarito.find({requisito:req.params.id});
        
        // Tratando a exclusão de um requisito
        gabaritos.forEach(async (element) => {
            // Tirando o requisito de cada gabarito
            // no array de requisito
            var arr = element.requisito.filter((item) => !(item.equals(req.params.id)));
            element.requisito = arr;
            await element.save();
        });

        return res.status(200).json('Requisito deleted with sucsess');
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default {
    store, index, show, update, remove
};
