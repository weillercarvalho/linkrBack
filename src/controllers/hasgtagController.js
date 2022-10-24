import { hashtagList, hashtagPosts } from "../repositories/hashtagRepositories.js";

async function getHashtag(req, res){
    try{
        const list = await hashtagList();
        res.status(200).send(list)

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
};

async function getHashtagPosts(req, res){
    const {hashtag} = req.params;
    try{
        const list = await hashtagPosts(hashtag);
        res.status(200).send(list)

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
};



export {getHashtag, getHashtagPosts};