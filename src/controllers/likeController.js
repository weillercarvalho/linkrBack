import { isLiked, likerPost, dislikePost, findUser, getNamePostLikers } from "../repositories/likeRepositories.js";

async function insertLike(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace(`Bearer `, ``);
    const {postId} = req.body;

    if(!token){
        return res.sendStatus(401);
    }


    try{
        const userId = await findUser(token);
        if(!userId){
            return res.sendStatus(401);
        } 
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
    const { authorization } = req.headers;
    const token = authorization?.replace(`Bearer `, ``);
    const {postId} = req.body;

    if(!token){
        return res.sendStatus(401);
    }

    try{
        const userId = await findUser(token);
        if(!userId){
            return res.sendStatus(401);
        } 
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

async function nameLikers(req, res){
    const { authorization,} = req.headers;
    const token = authorization?.replace(`Bearer `, ``);
    const {postId} = req.params;

    if(!token){
        return res.sendStatus(401);
    }

    try{
        console.log(postId);
        const userId = await findUser(token);
        if(!userId){
            return res.sendStatus(401);
        }
        const nameList = await getNamePostLikers(postId);
        console.log(req.headers)
        res.status(200).send(nameList)


    }catch(err){
        console.log(err);
        res.sendStatus(500);
    };
}



export {insertLike, dislike, nameLikers};