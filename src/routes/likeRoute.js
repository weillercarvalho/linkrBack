import express from 'express';
import { likerSchema } from '../middlewares/middlewareSchemas.js';
import { insertLike, dislike } from '../controllers/likeController.js';

const likeRouter = express.Router();

likeRouter.post("/like", likerSchema, insertLike);
likeRouter.delete("/like", likerSchema, dislike);

export default likeRouter;