const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().required().email().trim(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional().trim(),
  image: Joi.string().optional().trim(),
});

function UserValidation(req, res, next) {
  const { name, email, password, phone, image } = req.body;
  const { error } = userSchema.validate({ name, email, password, phone, image });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

module.exports = UserValidation;


