import { hashtagList } from "../repositories/hashtagRepositories.js";

async function getHashtag(req, res){
    try{
        const list = await hashtagList();
        res.status(200).send(list)

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
};

export {getHashtag};