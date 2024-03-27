import Joi from 'joi';

export const userSchema = Joi.object({
    firstName: Joi.string().min(3).max(30).regex(/^[a-zA-Z]+$/).required()
        .messages({
            "string.min": "First name must be at least {#limit} characters long",
            "string.max": "First name must be at most {#limit} characters long",
            "string.empty": "First name is required",
            "any.required": "First name is required",
            "string.pattern.base": "First name must only contain alphabetic characters"
        }),
    lastName: Joi.string().min(3).max(30).regex(/^[a-zA-Z]+$/).required()
        .messages({
            "string.min": "Last name must be at least {#limit} characters long",
            "string.max": "Last name must be at most {#limit} characters long",
            "string.empty": "Last name is required",
            "any.required": "Last name is required",
            "string.pattern.base": "Last name must only contain alphabetic characters"
        }),
    username: Joi.string().min(3).max(30).regex(/^[a-zA-Z0-9]+$/).required()
        .messages({
            "string.min": "Username must be at least {#limit} characters long",
            "string.max": "Username must be at most {#limit} characters long",
            "string.empty": "Username is required",
            "any.required": "Username is required",
            "string.pattern.base": "Username must only contain alphanumeric characters"
        }),
    email: Joi.string().min(5).max(50).email({ tlds: { allow: false } }).required()
        .messages({
            "string.min": "Email must be at least {#limit} characters long",
            "string.max": "Email must be at most {#limit} characters long",
            "string.email": "Invalid email format",
            "string.empty": "Email is required",
            "any.required": "Email is required"
        }),
    password: Joi.string().min(4).max(50).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).required()
        .messages({
            "string.min": "Password must be at least {#limit} characters long",
            "string.max": "Password must be at most {#limit} characters long",
            "string.empty": "Password is required",
            "any.required": "Password is required",
            "string.pattern.base": "Password must contain at least one letter, one number, and one special character"
        }),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Confirm password is required"
        }),
});

export const userSchemaLogin = Joi.object({
    emailUsername: Joi.string().min(5).max(50).required()
        .messages({
            "string.min": "Email/username must be at least {#limit} characters long",
            "string.max": "Email/username must be at most {#limit} characters long",
            "string.empty": "Email/username is required",
            "any.required": "Email/username is required"
        }),
    password: Joi.string().min(4).max(50).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).required()
        .messages({
            "string.min": "Password must be at least {#limit} characters long",
            "string.max": "Password must be at most {#limit} characters long",
            "string.empty": "Password is required",
            "any.required": "Password is required",
            "string.pattern.base": "Password must contain at least one letter, one number, and one special character"
        })
});