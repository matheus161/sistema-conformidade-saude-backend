import mongoose, { Schema, model } from 'mongoose';
import Joi from 'joi';

const GabaritoSchema = new Schema(
    {
        categoria: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categoria',
            required: true,
        },
        modalidade: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Modalidade',
            required: true
        },
        requisito: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Requisito',
            required: true
        }],
        estagio: {
            type: String,
            required: true
        }
    },

    { timeStamps: true, discriminatorKey: 'role' },
);

// Criando uma model
const Gabarito = model('Gabarito', GabaritoSchema);

// Fazendo a verificação dos atributos direto na rota
const gabaritoRules = Joi.object({
    categoria: Joi.string().required(),
    modalidade: Joi.string().required(),
    requisito: Joi.array().required(),
    estagio: Joi.string().valid('1','2','3').required()
});

export { Gabarito, gabaritoRules };