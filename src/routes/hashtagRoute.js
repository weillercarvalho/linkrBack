import express from 'express';
import { getHashtag, getHashtagPosts, getHashtagId } from '../controllers/hasgtagController.js';

const hashtagRouter = express.Router();

hashtagRouter.post("/hashtagId", getHashtagId);
hashtagRouter.get("/hashtags", getHashtag);
hashtagRouter.get("/hashtag/:hashtag", getHashtagPosts)

export default hashtagRouter;