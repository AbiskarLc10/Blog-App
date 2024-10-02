const Post = require("../database/Models/Post");
const adminPost = async (req, res, next) => {
  const { title, category, postImage, content } = req.body;

  const { isAdmin, id } = req.user;
  if (
    !title ||
    !category ||
    !content ||
    title === "" ||
    category === "" ||
    content === ""
  ) {
    return next({
      status: 401,
      message: "Please fill the fields",
      extraDetails: "Fields cannot be empty or null",
    });
  }

  if (!isAdmin) {
    return next({
      status: 401,
      message: "Cannot create a post",
      extraDetails: "Not an Admin",
    });
  }

  const slug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");
  const newPost = {
    title,
    category,
    postImage,
    content,
    slug,
    userId: id,
  };

  try {
    const postedData = await Post.create(newPost);
    console.log("Successful");
    if (postedData) {
      return res
        .status(200)
        .json({ message: "Post Created Successfully", postedData });
    }
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {

  try {

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm } },
          { content: { $regex: req.query.searchTerm } },
        ],
      }),
    }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);


    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth()-1,
      now.getDay()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  const postid = req.params.postId;
  const { isAdmin } = req.user;

  if (!isAdmin) {
    return next({
      status: 401,
      message: "Unauthorized",
      extraDetails: "Failed to delete post",
    });
  }
  try {
    const postToBeDeleted = await Post.findByIdAndDelete(postid);

    if (!postToBeDeleted) {
      next({
        status: 401,
        message: "Unable to delete post",
        extraDetails: "Error Occurred",
      });
    }
    res
      .status(200)
      .json({ message: "Post Deleted Successfully", postToBeDeleted });
  } catch (error) {
    next(error.message);
  }
};

const updatePost = async (req,res,next) => {
  const { postId,userId } = req.params;

  if(req.user.isAdmin && (req.user.id !== userId) ){
  return  next({status:401,message:"Unauthorized Access",extraDetails:"Unable to update data"})
  }
  const { title, category, content, postImage } = req.body;
  const updateData = {};

  try {

    console.log("Hello");
    if (title) {

      if(title.length < 5){
        next({message:"Too short title"})
      }
      updateData.title = title;
    }
    if (category) {
      updateData.category = category;
    }
    if (content) {
      if(content.length < 10){
        next({message:"Too short content"})
      }
      updateData.content = content;
    }
    if(postImage){
        updateData.postImage = postImage;
    }


    const updatedData = await Post.findByIdAndUpdate(postId,updateData,{new:true});
    
    if(!updatedData){
     return next({status:401,message:"Update Failed",extraDetails:"Error Occurred"});
    }else{

      return res.status(200).json({message:"Post updated Successfully",updateData})
    }

  } catch (error) {
    next(error.message)
  }
};

module.exports = { adminPost, getPosts, deletePost, updatePost };
