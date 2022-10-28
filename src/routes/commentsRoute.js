import express from "express";
import {
  insertComments,
  listComments,
} from "../controllers/commentsController.js";
import { validateToken } from "../middlewares/validateToken.js";

const commentsRouter = express.Router();

commentsRouter.post("/comments/:postId", validateToken, insertComments);
commentsRouter.get("/comments/:postId", listComments);

export default commentsRouter;
