import Joi from 'joi';

export const signupValidation = (req, res, next) => {
    // Trim the request body fields before validation
    req.body.name = req.body.name?.trim();
    req.body.email = req.body.email?.trim();

    const schema = Joi.object({
        name: Joi.string().required(),
        mnumber: Joi.number().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        rpassword: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'manager', 'intern').default('intern'),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error: error.details });
    }
    next();
}

export const loginValidation = (req, res, next) => {
    // Trim the request body fields before validation
    req.body.email = req.body.email?.trim();

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error: error.details });
    }
    next();
}
