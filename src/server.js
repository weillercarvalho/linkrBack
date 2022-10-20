import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connection } from "./database/db.js";

import routerAuth from "./routes/signRoutes.js";
import routerlogaut from "./routes/logoutRoute.js";

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

server.use(routerAuth);
server.use(routerlogaut);

server.get("/status", (req, res) => {
  res.send("ok");
});

server.listen(process.env.PORT, () => {
  console.log(`Listening on the ${process.env.PORT} port.`);
});
