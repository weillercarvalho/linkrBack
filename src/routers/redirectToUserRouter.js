const { Router } = require('express');
import {
  findUserByPost,
  findUsersByName,
  LoadUserPosts,
} from '../controllers/redirectToUserController.js';

const redirectToUserRouter = Router();
redirectToUserRouter.get('/users/:id', LoadUserPosts);
redirectToUserRouter.get('/findname', findUsersByName);
redirectToUserRouter.get('/findpost', findUserByPost);

export default redirectToUserRouter;

//Comments:
// ++ Need validateToken middleware
