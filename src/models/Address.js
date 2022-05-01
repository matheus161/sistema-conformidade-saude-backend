import { Schema } from 'mongoose';
import Joi from 'joi';

const Address = new Schema(
    {
        cep: {
            type: String,
            required: true
        },

        street: {
            type: String,
            required: true
        },

        neighborhood: {
            type: String,
            required: true
        },

        number: {
            type: Number,
            required: true
        },

        additionalInfo: {
            type: String,
            required: false
        }
    }
);

const addressRules = Joi.object({
    // O eslint diz que podemos remover a contrabarra. Será mesmo? Na dúvida, desabilitei o warning.
    // eslint-disable-next-line no-useless-escape
    cep: Joi.string().pattern(new RegExp(/^\d{5}-\d{3}$/)).required(),
    street: Joi.string().max(50).required(),
    neighborhood: Joi.string().max(50).required(),
    number: Joi.number().integer().positive().required(),
    additionalInfo: Joi.string().max(100)
});

export { Address, addressRules };
