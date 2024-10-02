const User = require("../database/Models/User");
const bcrypt = require('bcryptjs');
const deleteUser = async (req,res,next ) =>{

    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    if(!isAdmin && req.params.userid !== userId){
        return next({status:401,message:"Token not verified",extraDetails:"Unauthorized Access"});
    }

    try {

        const userToBeDeleted = await User.findByIdAndDelete(req.params.userid);

        if(userToBeDeleted){
                 
          return  res.status(200).json({message:"User Deleted Successfully"});
        }else{
            return next({status:401,message:"Unable to delete User",extraDetails:"Failed"});
        }
        
    } catch (error) {
        next(error)
    }
}
const updateUser = async (req,res,next) =>{


    const userId = req.user.id;
    // console.log(userId,req.params.userid);
    if(req.params.userid !== userId){

        return next({status:401,message:"Invalid User",extraDetails:"Unauthorized"});
    }



     const {username,password,profilePicture} = req.body;

  
    const updateData = {};
    if(username){

        if(username!==username.toLowerCase()){
            return next({status:400,extraDetails:"Username should be in lowercase"})

        }
        if(username.length < 7){
            return next({status:400,extraDetails:"Username should be atleast 7 characters",message:"Too Short"})
        }

        if(!username.match(/^[a-zA-Z0-9]+$/)){
            return next({status:400,extraDetails:"Username should be either characters or numbers",message:"Invalid username"})

        }
        updateData.username=username};
    if(password){
        if(password.length < 7){
            return next({status:400,extraDetails:"Password should be atleast 5 characters",message:"Too Short"})
        }
        const hashpassword = await bcrypt.hash(password,10);
        updateData.password = hashpassword;
    };
    if(profilePicture){updateData.profilePicture=profilePicture};


    try {

        const userToBeUpdated = await User.findByIdAndUpdate(userId,updateData,{new:true});
console.log("hello");
    const {password,...rest} = userToBeUpdated._doc;
        if(userToBeUpdated){

            return res.status(200).json({message:"User updated Successfully",rest})
        }else{
            next({message:"Unable to update User"});
        }
        
    } catch (error) {
        next(error.message);
    }

}

const getAllUsers = async(req,res,next)=>{


    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 7;
    const sortDirection = req.query.sort === "asc"?1:-1;


    const {isAdmin} = req.user;

    try {
    if(!isAdmin){
        return next({status:403,message:"You are not allowed to see all users",extraDetails:"Unauthorized Access"});
    }

    const users = await User.find({},{password:0}).sort({ createdAt: sortDirection},).limit(limit).skip(startIndex);

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth()-1,
      now.getDay()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    if(!users){
        return next({status:401,message:"Failed to fetch data"});
    }else{
        return res.status(200).json({users,totalUsers,lastMonthUsers});
    }
 

               
    } catch (error) {
        next(error)
    }
}


const getuser = async(req,res,next) =>{

    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if(!user){
          return   next({status:401,message:"Failed to fetch user"})
        }
            
        return res.status(200).json({user});

    } catch (error) {
        next(error.message);
    }
}




module.exports = {updateUser,deleteUser,getAllUsers,getuser};