import { Schema, model } from 'mongoose';
import Joi from 'joi';

const CategoriaSchema = new Schema(
    {
        titulo: {
            type: String,
            required: true,
        }
    },

    { timeStamps: true, discriminatorKey: 'role' },
);

// Criando uma model
const Categoria = model('Categoria', CategoriaSchema);

// Fazendo a verificação dos atributos direto na rota
const categoriaRules = Joi.object({
    titulo: Joi.string().required(),
});

export { Categoria, categoriaRules };
