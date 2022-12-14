import { STATUS_CODE } from "../enums/statusCodes.js";
import joi from "joi";

const postSignupSchema = joi.object({
  name: joi.string().trim().required(),
  email: joi.string().email().trim().required(),
  password: joi.string().min(5).required(),
  picture: joi.string().uri().required(),
});

const postSigninSchema = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().min(5).required(),
});

const likeSchema = joi.object({
  postId:joi.number().required()
})

function signupSchema(req, res, next) {
  const { picture } = req.body;

  const validation = postSignupSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const error = validation.error.details.map((value) => value.message);
    return res.status(STATUS_CODE.UNPROCESSABLE).send({ error: error });
  }

  const regexUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(picture);
  if (!regexUrl) {
    return res
      .status(STATUS_CODE.UNPROCESSABLE)
      .send({ error: "available picture" });
  }

  next();
}

function signinSchema(req, res, next) {
  const validation = postSigninSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const error = validation.error.details.map((value) => value.message);
    return res.status(STATUS_CODE.UNPROCESSABLE).send({ error: error });
  }

  next();
};

function likerSchema(req, res, next) {
  const validation = likeSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map((value) => value.message);
    return res.status(422).send(errors);
  }

  next();
};

export { signupSchema, signinSchema, likerSchema };
