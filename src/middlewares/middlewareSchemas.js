import joi from "joi";
const postSigninSchema = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().min(4).required(),
});

function signinSchema(req, res, next) {
  const validation = postSigninSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map((value) => value.message);
    return res.status(422).send(errors);
  }

  next();
}

export { signinSchema };
