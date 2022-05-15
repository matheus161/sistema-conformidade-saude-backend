import mongoose, { Schema, model } from 'mongoose';
import Joi from 'joi';

const RequisitoSchema = new Schema(
    {
        nameId: {
            type: String,
            required: true,
        },
        titulo: {
            type: String,
            required: true,
        },
        descricao: {
            type: String,
            required: true,
        },
        grupoRequisito: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GrupoRequisito',
            required: true,
        },
    },

    { timeStamps: true, discriminatorKey: 'role' },
);

// Criando uma model
const Requisito = model('Requisito', RequisitoSchema);

// Fazendo a verificação dos atributos direto na rota
const requisitoRules = Joi.object({
    nameId: Joi.string(),
    titulo: Joi.string().required(),
    descricao: Joi.string().required(),
    grupoRequisito: Joi.string().required(),
});

export { Requisito, requisitoRules };
