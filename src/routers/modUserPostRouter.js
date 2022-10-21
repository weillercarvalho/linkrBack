const { Router } = require('express');
import {
  updatePost,
  deletePost,
} from '../controllers/modUserPostController.js';
import { validateToken } from '../middlewares/validateToken.js';

const redirectToUserRouter = Router();
redirectToUserRouter.put('/users/:id', validateToken, updatePost);
redirectToUserRouter.put('/users/:id', validateToken, deletePost);

export default redirectToUserRouter;
