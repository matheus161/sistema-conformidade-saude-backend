import { Schema } from 'mongoose';
import Joi from 'joi';
import { User, userRules } from './User';

const VendorSchema = new Schema({
    cnpj: {
        type: String,
        required: true
    }
});

const Vendor = User.discriminator('Vendor', VendorSchema);

const vendorRules = userRules.concat(Joi.object({
    role: Joi.string().valid('Vendor'),
    // eslint-disable-next-line no-useless-escape
    cnpj: Joi.string().pattern(new RegExp(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)).required()
}));

export { Vendor, vendorRules };
