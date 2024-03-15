import Joi from 'joi';

export const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).regex(/^[a-zA-Z0-9]+$/).required(),
    firstName: Joi.string().min(3).max(30).regex(/^[a-zA-Z]+$/).required(),
    lastName: Joi.string().min(3).max(30).regex(/^[a-zA-Z]+$/).required(),
    password: Joi.string().min(4).max(50).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).required(),
    email: Joi.string().email({ tlds: { allow: true } }).required()
})