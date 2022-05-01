import { Schema, model } from 'mongoose';
import Joi from 'joi';
import PasswordUtils from '../utils/PasswordUtils';

const UserSchema = new Schema(
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
            select: false,
        },
    },

    { timeStamps: true, discriminatorKey: 'role' },
);

// Deve-se usar function() e não arrow function por causa do this.
// eslint-disable-next-line func-names
UserSchema.pre('save', async function (next) {
    this.password = await PasswordUtils.encrypt(this.password);
    next();
});

const User = model('User', UserSchema);

const emailRules = Joi.string().email().required();
const passwordRules = Joi.string().min(8).max(40).required();

const userRules = Joi.object({
    name: Joi.string().pattern(new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$/)).required(),
    email: emailRules,
    password: passwordRules,
});

const authRules = Joi.object({
    email: emailRules,
    password: passwordRules,
});

export { User, userRules, authRules };
