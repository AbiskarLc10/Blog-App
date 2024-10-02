
const Comment = require('../database/Models/Comment');
const postComment = async (req,res,next) =>{


const {userId,postId,content} = req.body;
    try {

        if(userId !== req.user.id){
            return next({status:401,message:"You are not allowed to comment"});
        }

        if(!userId || !postId || !content || content===""){
          return  next({status:403,message:"please fill the comment"})
        }
        if(content.length<5){
            return next({status:403,message:"Comment is too short"});
        }
        
        const comment = await Comment.create({
            content,
            postId,
            userId
        }) 

        if(!comment){
            return next({status:403,message:"Failed to post comment"});
        }

        return res.status(200).json({message:"Comment sent",comment});
    } catch (error) {
        next(error);
    }
}

const getComments = async (req,res,next) =>{

    const  postId = req.params.postId;
      
    try {

        const comments = await Comment.find({
        postId:postId
        }).sort({createdAt:-1});

        if(!comments){
            return next({status:403,message:"Failed to fetch comments"});
        }

        return res.status(200).json({comments});
        
    } catch (error) {
        
        next({status:400,message:"Failed to load comments"});
    }
}


const likeComment = async (req,res,next) =>{


    try {

        const commentId = req.params.commentId;

        const comment = await Comment.findById(commentId);
        if(!comment){
            return next({status:403,message:"Comment not found"});
        }

        const userIndex = comment.likes.indexOf(req.user.id);
        console.log(userIndex);

        if(userIndex === -1){
             
            comment.numberofLikes += 1;
            comment.likes.push(req.user.id)
        }else{
            comment.numberofLikes -= 1;
            comment.likes.splice(userIndex,1);
        }
        await comment.save();
        return res.status(200).json({comment})
    } catch (error) {
        next(error.message)
    }
}

const deleteComment = async (req,res,next) =>{

    try {

        const commentId = req.params.commentId;

        const commentToBeDeleted = await Comment.findById(commentId);

        if(!commentToBeDeleted){
            return next({status:404,message:"Comment not found"});
        }
        console.log(req.user.id, commentToBeDeleted.userId )
        if(req.user.id!== commentToBeDeleted.userId){
            return next({status:401,message:"You are not allowed to delete this comment"});
        }

        const deleteComment = await Comment.findByIdAndDelete(commentId);

        if(deleteComment){
            return res.status(200).json({message:"Comment Deleted Successfully",comment:deleteComment})
        }
        
    } catch (error) {
        next(error.message);
    }
}


const editComment = async (req,res,next) =>{


    const commentId = req.params.commentId;


    try {
        const commentToBeUpdated = await Comment.findById(commentId);

        if(!commentToBeUpdated){
            return next({status:404,message:"Comment not found"});
        }
        if(!req.user.isAdmin && req.user.id !== commentToBeUpdated.userId){
            return next({status:401,message:"You are not allowed to edit"});
        }

        const editedComment = await Comment.findByIdAndUpdate(commentId,{
            content:req.body.content
        },{new:true});

        if(!editedComment){
          return  next({status:401,message:"Failed to edit comment"})
        }

        return res.status(200).json({editedComment});

        
    } catch (error) {
        next(error.message);
    }
}


const getAllComments = async (req,res,next) =>{


    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const sortDirection = req.query.sort === "asc"?1:-1;

    try {
        if(!req.user.isAdmin){
            return next({status:401,message:"Unauthorized access",extraDetails:"You cannot see all comments"})
        }

        const comments = await Comment.find().limit(limit).skip(startIndex).sort({ updatedAt: sortDirection });

        if(!comments){
            return next({status:400,message:"Failed to fetch comments"});
        }

        const totalNumberofComments = await Comment.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        );

        const lastMonthsComments = await Comment.countDocuments({createdAt:{$gte: oneMonthAgo}})

        return res.status(200).json({comments,totalNumberofComments,lastMonthsComments});
    } catch (error) {
        next(error);
    }
}
module.exports = {postComment,getComments,likeComment,deleteComment,editComment,getAllComments}