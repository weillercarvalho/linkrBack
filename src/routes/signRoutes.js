import express from "express";
import { postSignin } from "../controllers/signControllers.js";
import { signinSchema } from "../middlewares/middlewareSchemas.js";
const routerAuth = express.Router();
routerAuth.post("/signin", signinSchema, postSignin);

export default routerAuth;
