import express from "express";
import { deleteSession } from "../controllers/logoutControllers.js";

const routerlogaut = express.Router();
routerlogaut.post("/logout", deleteSession);

export default routerlogaut;
