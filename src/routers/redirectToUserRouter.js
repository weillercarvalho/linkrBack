import { Router } from 'express';
import {
  findUserByPost,
  findUsersByName,
  LoadUserPosts,
  findUserByID,
} from '../controllers/redirectToUserController.js';
import { validateToken } from '../middlewares/validateToken.js';

const redirectToUserRouter = Router();
redirectToUserRouter.get('/users/:id', LoadUserPosts);
redirectToUserRouter.get('/findname', findUsersByName);
redirectToUserRouter.get('/findpost', findUserByPost);
redirectToUserRouter.get('/finduser', findUserByID);

//!IMPORTANT! ADD validateToken middleware on all routes

export default redirectToUserRouter;
