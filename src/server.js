import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connection } from "./database/db.js";

import routerAuth from "./routes/signRoutes.js";
import routerlogaut from "./routes/logoutRoute.js";
import likeRouter from "./routes/likeRoute.js";
import hashtagRouter from "./routes/hashtagRoute.js"

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

server.use(routerAuth);
server.use(routerlogaut);
server.use(likeRouter);
server.use(hashtagRouter);

server.get("/status", (req, res) => {
  res.send("ok");
});

server.listen(process.env.PORT, () => {
  console.log(`Listening on the ${process.env.PORT} port.`);
});
