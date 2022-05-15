import { Schema, model } from 'mongoose';
import Joi from 'joi';

const GrupoReqSchema = new Schema(
    {
        titulo: {
            type: String,
            required: true
        },
        descricao: {
            type: String,
            required: true
        },
    },
    { timeStamps: true, discriminatorKey: 'role' },
);

const GrupoRequisito = model('GrupoRequisito', GrupoReqSchema);

const grupoReqRules = Joi.object({
    titulo: Joi.string().required(),
    descricao: Joi.string().required(),
});

export { GrupoRequisito, grupoReqRules };
