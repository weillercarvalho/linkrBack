import express from 'express';
import { getHashtag, getHashtagPosts } from '../controllers/hasgtagController.js';

const hashtagRouter = express.Router();

hashtagRouter.get("/hashtags", getHashtag);
hashtagRouter.get("/hashtag/:hashtag", getHashtagPosts)

export default hashtagRouter;