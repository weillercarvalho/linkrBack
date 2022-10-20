import express from 'express';
import { likerSchema } from '../middlewares/middlewareSchemas.js';
import { insertLike } from '../controllers/likeController.js';

const likeRouter = express.Router();

likeRouter.post("/like", likerSchema, insertLike);

export default likeRouter;