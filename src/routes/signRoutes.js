import express from "express";
import { postSignin, postSignup } from "../controllers/signControllers.js";
import {
  signupSchema,
  signinSchema,
} from "../middlewares/middlewareSchemas.js";
const routerAuth = express.Router();
routerAuth.post("/signin", signinSchema, postSignin);
routerAuth.post("/signup", signupSchema, postSignup);

export default routerAuth;
