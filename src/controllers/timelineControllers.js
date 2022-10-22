import {connection} from "../database/db.js";
import { findUser, isLiked } from "../repositories/likeRepositories.js";
import {insertPost, getPost, getPictures} from "../repositories/timelineRepositories.js"

async function postTimeline(req,res) {
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
        const query = await insertPost(message,link,useridinsert)
        return res.send(201)
    } catch (error) {
        return res.status(500).send({message: "An error occured while trying to fetch the posts, please refresh the page"})
    }

}

//leo: Quero Discutir com o grupo.
async function getTimeline(req,res) {
    //const {authorization}  = req.headers;
    //const token = authorization?.replace(`Bearer `, ``);

    try {
      const query = await getPost();
      //if(!token){
        return res.send(query.rows)
      //}
      /*const userId = await findUser(token);
      const postsIds = [];
      query.rows.map(value=> postsIds.push(value.id))
      const list = postsIds.map(async value=> await isLiked(userId, value))
      const timeLine = [];
      query.rows.map((values,id)=>timeLine.push({
        ...values,
        liked: list[id]
      }));
      console.log(list);
      return res.send(timeLine);*/
    } catch (error) {
      console.log(error)
      return res.status(500).send({message: "An error occured while trying to fetch the posts, please refresh the page"})
    }
}

async function getPicture(req,res) {
    try {
      const query = await getPictures();
      return res.send(query.rows[0])
    } catch (error) {
      return res.status(500).send({message: "An error occured while trying to fetch the posts, please refresh the page"})
    }
  
  }
export {postTimeline, getTimeline, getPicture};