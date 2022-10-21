import express from 'express';
import { getHashtag } from '../controllers/hasgtagController.js';

const hashtagRouter = express.Router();

hashtagRouter.get("/hashtags", getHashtag);

export default hashtagRouter;