import { Schema, model } from 'mongoose';
import Joi from 'joi';
import PasswordUtils from '../utils/PasswordUtils';

const AdminSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 40,
        },
    },

    { timeStamps: true, discriminatorKey: 'role' },
);

// Deve-se usar function() e não arrow function por causa do this.
AdminSchema.pre('save', async function (next) {
    this.password = await PasswordUtils.encrypt(this.password);
    next();
});

const Admin = model('Admin', AdminSchema);

const emailRules = Joi.string().email().required();
const passwordRules = Joi.string().min(8).max(40).required();

const adminRules = Joi.object({
    name: Joi.string().pattern(new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$/)).required(),
    email: emailRules,
    password: passwordRules,
});

const authAdminRules = Joi.object({
    email: emailRules,
    password: passwordRules,
});

export { Admin, adminRules, authAdminRules };
