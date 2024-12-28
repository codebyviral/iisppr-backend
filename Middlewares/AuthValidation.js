import Joi from 'joi';
import moment from 'moment';

export const signupValidation = (req, res, next) => {
    req.body.name = req.body.name?.trim();
    req.body.email = req.body.email?.trim();

    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required',
        }),
        mnumber: Joi.number()
        .integer()
        .min(6000000000) // Minimum valid mobile number starting with 6
        .max(9999999999) // Maximum valid 10-digit mobile number
        .required()
        .messages({
            'number.base': 'Mobile number must be a valid number',
            'number.min': 'Mobile number must be at least 10 digits starting with 6-9',
            'number.max': 'Mobile number must be at most 10 digits',
            'any.required': 'Mobile number is required',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required',
        }),
        rpassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords must match',
            'any.required': 'Confirm password is required',
        }),
        role: Joi.string()
            .valid('admin', 'manager', 'intern')
            .default('intern')
            .messages({
                'any.only': 'Role must be one of admin, manager, or intern',
            }),
        startDate: Joi.custom((value, helpers) => {
            if (!value) {
                return new Date(); // Default to current date if no value provided
            }
            const date = moment(value, ['YYYY-MM-DD', 'DD-MM-YYYY'], true);
            if (!date.isValid()) {
                return helpers.error('date.base', { value });
            }
            return date.toDate();
        }).default(() => new Date()).messages({
            'date.base': 'Start date must be a valid date in YYYY-MM-DD or DD-MM-YYYY format',
        }),
    }).strict();

    const { error } = schema.validate(req.body);
    if (error) {
        console.log(`Auth signup Validation Error: ${error}`)
        return res.status(400).json({ message: 'Bad request', error: error.details });
    }
    next();
};

export const loginValidation = (req, res, next) => {
  // Trim the request body fields before validation
  req.body.email = req.body.email?.trim();

  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
  }).strict(); // Ensures that only the defined fields are allowed

  const { error } = schema.validate(req.body);
  if (error) {
    console.log(`Auth login Validation Error: ${error}`)
    return res
      .status(400)
      .json({ message: "Bad request", error: error.details });
  }
  next();
};
