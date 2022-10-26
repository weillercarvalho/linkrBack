import express from 'express';
import {postTimeline, getTimeline, getPicture} from "../controllers/timelineControllers.js";

const timelinerouter = express.Router();

timelinerouter.post("/timeline", postTimeline)

timelinerouter.get("/timeline", getTimeline)

timelinerouter.get("/picture", getPicture);


export default timelinerouter;