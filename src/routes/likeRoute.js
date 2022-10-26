import express from 'express';
import { likerSchema } from '../middlewares/middlewareSchemas.js';
import { insertLike, dislike, nameLikers } from '../controllers/likeController.js';

const likeRouter = express.Router();

likeRouter.post("/like", likerSchema, insertLike);
likeRouter.put("/like", likerSchema, dislike);
likeRouter.get("/namelikers/:postId", nameLikers);

export default likeRouter;