import express from 'express';
import { likerSchema } from '../middlewares/middlewareSchemas.js';
import { insertLike, dislike, nameLikers, findUserIdByToken } from '../controllers/likeController.js';

const likeRouter = express.Router();

likeRouter.post("/like", likerSchema, insertLike);
likeRouter.put("/like", likerSchema, dislike);
likeRouter.get("/namelikers/:postId", nameLikers);
likeRouter.get("/likeId", findUserIdByToken);


export default likeRouter;