import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connection} from "./database/db.js"


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


const isValidUrl = (urlString) => {
    let urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!urlPattern.test(urlString);
  };

server.post("/timeline", async (req,res) => {
    // const {authorization}  = req.headers;
    const {message, link} = req.body;
    // const token = authorization?.replace(`Bearer `, ``);
    // if(!token) {
    //     return res.sendStatus(409);
    // }

    try {
        const gettingUserId = await connection.query(`SELECT * FROM sessions ORDER BY id DESC LIMIT 1`);
        // const gettinToken = gettingUserId.rows[0].token
        // if (gettinToken !== token) {
        //     return res.sendStatus(409);
        // }
        // if(!isValidUrl(link)) {
        //     return res.sendStatus(422)
        // }
        const useridinsert = gettingUserId.rows[0].userId;
        const query = await connection.query(`INSERT INTO posts (message,link,"userId") VALUES ($1,$2,$3)`,[message,link,useridinsert])
        return res.send(201)
    } catch (error) {
        return res.status(500).send(error.message)
    }

})

server.get("/timeline", async (req,res) => {
    const query = await connection.query (`SELECT * FROM posts ORDER BY id DESC LIMIT 20`);
    return res.send(query.rows)
})
server.listen(process.env.PORT, () => {
  console.log(`Listening on the ${process.env.PORT} port.`);
});
