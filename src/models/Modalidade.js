import { Schema, model } from 'mongoose';
import Joi from 'joi';

const ModalidadeSchema = new Schema(
    {
        tipo: {
            type: String,
            required: true,
        }
    },

    { timeStamps: true, discriminatorKey: 'role' },
);

// Criando uma model
const Modalidade = model('Modalidade', ModalidadeSchema);

// Fazendo a verificação dos atributos direto na rota
const modalidadeRules = Joi.object({
    tipo: Joi.string().required(),
});

export { Modalidade, modalidadeRules };
