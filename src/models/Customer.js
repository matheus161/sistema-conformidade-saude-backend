import { Schema } from 'mongoose';
import Joi from 'joi';
import { User, userRules } from './User';
import { Address, addressRules } from './Address';

const CustomerSchema = new Schema({
    address: {
        type: Address,
        required: true
    },
});

const Customer = User.discriminator('Customer', CustomerSchema);

const customerRules = userRules.concat(Joi.object({
    role: Joi.string().valid('Customer', 'customer'),
    address: addressRules.required()
}));

export { Customer, customerRules };
