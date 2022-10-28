import { Router } from 'express';
import { sharePost } from '../controllers/shareController.js';
import { validateToken } from '../middlewares/validateToken.js';

const shareRouter = Router();
shareRouter.post('/share', validateToken, sharePost);

export default shareRouter;
