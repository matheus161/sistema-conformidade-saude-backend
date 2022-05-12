import mongoose, { Schema, model } from 'mongoose';
import Joi from 'joi';

const AvaliacaoSchema = new Schema(
    {
        nome: {
            type: String,
            required: true 
        },
        versao: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        qtdSim: {
            type: Number,
            default: 0
        },
        qtdNao: {
            type: Number,
            default: 0
        },
        nextIndex: {
            type: Number,
            default: 0
        },
        dataCreate: {
            type: Date,
            required: true,
        },
        lastUpdate: {
            type: Date,
            required: true
        },
        respostas: [{
            requisito: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Requisito',
                required: true
            },
            answer: {
                type: String,
                default: null
            },
        }],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        gabarito: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gabarito',
            required: true
        },
        // avaliador: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User'
        // },
        colaborador: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },

    { timeStamps: true, discriminatorKey: 'role' },
);

// Criando uma model
const Avaliacao = model('Avaliacao', AvaliacaoSchema);

// Fazendo a verificação dos atributos direto na rota
const avaliacaoRules = Joi.object({
    nome: Joi.string().required(),
    versao: Joi.string().required(),
    status: Joi.string().valid('Aberto','Finalizado').required(),
    gabarito: Joi.string().required(),
});

const avaliacaoUpdateRules = Joi.object({
    nome: Joi.string(),
    versao: Joi.string(),
    status: Joi.string().valid('Aberto','Finalizado'),
    avaliador: Joi.string()
});

export { Avaliacao, avaliacaoRules, avaliacaoUpdateRules };