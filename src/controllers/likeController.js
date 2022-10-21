import { isLiked, likerPost, dislikePost } from "../repositories/likeRepositories.js";

async function insertLike(req, res){
    const {userId, postId} = req.body;

    try{
        const liked = await isLiked(userId, postId);
        if(liked){
            return res.status(409).send("Post already liked!");
        };

        await likerPost(userId, postId);

        return res.status(201).send("Like registered!");

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    };
};

async function dislike(req, res){
    const {userId, postId} = req.body;

    try{
        const liked = await isLiked(userId, postId);
        if(!liked){
            return res.status(404).send("Post not liked!");
        };

        await dislikePost(userId, postId);

        return res.status(200).send("not like :(");

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    };
};



export {insertLike, dislike};