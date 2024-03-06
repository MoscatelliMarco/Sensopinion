import Joi from 'joi';

export const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).regex(/^[a-zA-Z0-9]+$/).required(),
    password: Joi.string().min(4).max(50).regex(/^[a-zA-Z0-9~@#^&*()_+=[\]{}|\\,.?: -]+$/).required(),
    email: Joi.string().email({ tlds: { allow: true } }).required()
})