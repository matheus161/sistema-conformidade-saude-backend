import { Avaliacao } from "../models/Avaliacao";
import { Gabarito } from "../models/Gabarito";
import { Categoria } from "../models/Categoria";
import { Modalidade } from "../models/Modalidade";
import { User } from "../models/User";
import addColaborador from '../constants/email_body/addColaborador';
import remColaborador from '../constants/email_body/remColaborador';
import mailer from '../lib/mailer';

async function store(req, res) {
    try {
        const { userId } = req;
        const { gabarito } = req.body;
        
        // Checando se o gabarito existe
        const gabaritoExists = await Gabarito.findById(gabarito);
        if (!gabaritoExists) {
            return res.status(404).json({ message: 'Gabarito not found' });
        }
        
        // Criando objeto data 
        var date = new Date();

        // Setando o User, data e lastUpdate
        req.body.user = userId;
        req.body.dataCreate = date;
        req.body.lastUpdate = date;

        // Pegando todos os requisitos e preenchendo o array resposta
        let arr = [];
        for (let pos = 0; pos < gabaritoExists.requisito.length; pos++) {
            //arr[index] = gabaritoExists.requisito[index];
            arr[pos] = {['requisito']:gabaritoExists.requisito[pos]};
        }
        req.body.respostas = arr;
        req.body.total = arr.length; // Pegando a quantidade de requisitos

        // Criando Avaliacao
        const avaliacao = await Avaliacao.create(req.body);

        return res.status(201).json(avaliacao);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function index(req, res) {
    try {
        const {userId} = req;

        const avaliacao = await Avaliacao
            .find({ user: userId})
            .populate(['user', 'respostas.requisito']); 

        // Paginação
        const page = parseInt(req.query.page) || 0;

        const limit = 10;

        const startIndex = page * limit;

        const endIndex = (page + 1) * limit;

        const paginatedResults = avaliacao.slice(startIndex, endIndex);
        
        return res.status(200).json(paginatedResults);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function show(req, res) {
    try {
        const avaliacao = await Avaliacao
            .findById(req.params.id)
            .populate(['user', 'gabarito',
             'respostas.requisito', 'colaborador']);

        if (!avaliacao) {
            return res.status(404).json({ message: 'Avaliacao not found' });
        }

        if (avaliacao.gabarito.categoria) {
            // Populate não funciona como eu preciso
            const categoria = await Categoria.findOne(avaliacao.gabarito.categoria);
            avaliacao.gabarito.categoria = categoria;
        } 
        if (avaliacao.gabarito.modalidade) {
            // Populate não funciona como eu preciso
            const modalidade = await Modalidade.findOne(avaliacao.gabarito.modalidade);
            avaliacao.gabarito.modalidade = modalidade;
        } 

        return res.status(200).json(avaliacao);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function answer(req, res) {
    try {
        const { id, index, answer } = req.params; 

        const avaliacao = await Avaliacao.findById(id);
        if (!avaliacao) {
            return res.status(404).json({ message: 'Avaliacao not found' });
        }

        // Checando se ele é o próximo não respondido
        // Não pode responder um sem reponder o anterior
        if (index > avaliacao.nextIndex)
            return res.status(404).json({ message: 'Index not valid' }); 

        // Criando objeto data 
        var date = new Date();

        // Alterando parâmetros de contagem
        // Tratando para não contar a mais
        if ( avaliacao.respostas[index].answer === null) {
            if (answer === 'Sim' ) {
                // Acrescentando na quantidade de Sim respondidos
                avaliacao.qtdSim = avaliacao.qtdSim + 1;
                
            } else if (answer === "Nao") {
                // Acrescentando na quantidade de Não respondidos
                avaliacao.qtdNao = avaliacao.qtdNao + 1;
            }
            // Alterando o próximo a ser respondido
            avaliacao.nextIndex = avaliacao.nextIndex + 1;
        } else if (avaliacao.respostas[index].answer === 'Sim' && answer === 'Nao') {
            avaliacao.qtdSim = avaliacao.qtdSim - 1;
            avaliacao.qtdNao = avaliacao.qtdNao + 1;
        } else if (avaliacao.respostas[index].answer === 'Nao' && answer === 'Sim') {
            avaliacao.qtdSim = avaliacao.qtdSim + 1;
            avaliacao.qtdNao = avaliacao.qtdNao - 1;
        }

        // Alterando a resposta no index passado
        // Altero minha resposta e passo meu requisito de novo
        avaliacao.respostas[index] = {['answer']:answer, ['requisito']:avaliacao.respostas[index].requisito}; 
    
        avaliacao.lastUpdate = date;// Alterando a data de atualização

        await avaliacao.save();

        return res.status(200).json(avaliacao);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function remove(req, res) {
    try {
        const avaliacaoDeleted = await Avaliacao.findById(req.params.id);
    
        if(!avaliacaoDeleted) {
            return res.status(404).json({ message: 'Avaliacao not found' });
        }
        avaliacaoDeleted.remove();
        return res.status(200).json({ message: 'Avaliacao deleted with sucsess' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function addCollab(req, res) {
    try {
        const { colaborador } = req.body;

        // Adicionado um novo coladorador
        // Checando se a Avalicação existe
        const avaliacao = await Avaliacao.findById(req.params.id);
        if (!avaliacao) {
            return res.status(404).json({ message: 'Avalicao not found' });
        }

        // Procurando um colaborador através do email
        const user = await User.findOne({ email: colaborador });
        //Checando se o colaborador passado é válido   
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Checando se ele está tentado se proprio adicionar
        if( user._id.equals(avaliacao.user)) {
            return res.status(404).json({ message: 'Operation not allowed' });
        }
        
        //Checando se o colaborador já existe     
        for (let index = 0; index < avaliacao.colaborador.length; index++) {
            if(user._id.equals(avaliacao.colaborador[index]))
                return res.status(404).json({ message: 'User already a Colaborador' });
        }

        // Adicionando o id de User no Array
        var arr = avaliacao.colaborador;
        arr.push(user.id);

        avaliacao.colaborador = arr || avaliacao.colaborador;
        avaliacao.save();

        // Enviando email
        mailer.sendMail({
            from: 'Equipe Avalia SBIS <validasbis@hotmail.com>',
            to: colaborador,
            subject: 'Você agora é um colaborador',
            html: addColaborador(user.name, avaliacao.nome),
        }).catch(console.error);

        return res.status(200).json({ message: 'Colaborador adicionado com sucesso!'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function remCollab(req, res) {
    try {
        const { colaborador } = req.body;

        // Removendo um coladorador
        // Checando se a Avalicação existe
        const avaliacao = await Avaliacao.findById(req.params.id);
        if (!avaliacao) {
            return res.status(404).json({ message: 'Avalicao not found' });
        }
        
        // Procurando um colaborador através do email
        const user = await User.findOne({ email: colaborador });
        //Checando se o colaborador passado é válido   
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (avaliacao.colaborador.length === 1) {
            avaliacao.colaborador = [];
        } else {
            var arr = avaliacao.colaborador.filter((item) => !(item.equals(user._id)));
            avaliacao.colaborador = arr || avaliacao.colaborador;
        }   

        avaliacao.save();

        // Enviando email
        mailer.sendMail({
            from: 'Equipe Avalia SBIS <validasbis@hotmail.com>',
            to: colaborador,
            subject: 'Você não é não mais um colaborador',
            html: remColaborador(user.name, avaliacao.nome),
        }).catch(console.error);

        return res.status(200).json({ message: 'Colaborador removido com sucesso!'});
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function indexCollab(req, res) {
    try {
        // Mostrar todos as avaliações que aquele
        // user é colaborador
        const { userId } = req;
        const avaliacoes = await Avaliacao
            .find({ colaborador: userId })
            .populate(['user', 'gabarito', 'respostas.requisito']);

        if (!avaliacoes) {
            return res.status(404).json({ message: 'Avalicao not found' });
        }

        // Paginação
        const page = parseInt(req.query.page) || 0;

        const limit = 10;

        const startIndex = page * limit;

        const endIndex = (page + 1) * limit;

        const paginatedResults = avaliacoes.slice(startIndex, endIndex);

        return res.status(200).json(paginatedResults);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function update(req, res) {
    try {
        const avaliacaoUpdated = await Avaliacao.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return res.status(200).json(avaliacaoUpdated);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default { store, index, show,  answer, remove, addCollab, remCollab, indexCollab, update }; 
