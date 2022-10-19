import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connection} from './database/db.js'

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.listen(process.env.PORT, () => {
    console.log(`Listening on the ${process.env.PORT} port.`)
})