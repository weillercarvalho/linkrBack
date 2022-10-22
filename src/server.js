import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routerAuth from './routes/signRoutes.js';
import routerlogaut from './routes/logoutRoute.js';
import timelinerouter from './routes/timelineRoute.js';
import redirectToUserRouter from './routes/redirectToUserRouter.js';
import modUserPostRouter from './routes/modUserPostRouter.js';
dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

server.use(routerAuth);
server.use(routerlogaut);
server.use(timelinerouter);
server.use(redirectToUserRouter);
server.use(modUserPostRouter);

server.get('/status', (req, res) => {
  res.send('ok');
});

server.listen(process.env.PORT, () => {
  console.log(`Listening on the ${process.env.PORT} port`);
});
