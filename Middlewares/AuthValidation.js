import Joi from 'joi';

export const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required().trim(),
        mnumber: Joi.number().required(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().min(6).required(),
        rpassword: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'manager', 'intern').default('intern'),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
export const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}