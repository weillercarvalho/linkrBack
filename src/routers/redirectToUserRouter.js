const { Router } = require('express');
import {
  findUserByPost,
  findUsersByName,
  LoadUserPosts,
} from '../controllers/redirectToUserController.js';
import { validateToken } from '../middlewares/validateToken.js';

const redirectToUserRouter = Router();
redirectToUserRouter.get('/users/:id', validateToken, LoadUserPosts);
redirectToUserRouter.get('/findname', validateToken, findUsersByName);
redirectToUserRouter.get('/findpost', validateToken, findUserByPost);

export default redirectToUserRouter;
