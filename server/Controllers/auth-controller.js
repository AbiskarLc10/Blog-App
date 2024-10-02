const User = require("../database/Models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createUser =async (req,res,next)=>{

    const {username,email,password} = req.body;
    console.log(req.body);
const hashPassword = await bcrypt.hash(password,10);
    const userdata = {
        username,
        email,
        password:hashPassword
    }
    try {
        

        const userCreate = await  User.create(userdata);

        const {password,...rest } = userCreate._doc;
        if(userCreate){
            res.status(200).json({message:"User created successfully",rest});
        }
    } catch (err) {
      
        const message = "Failed to create user";
        const status = 400;
        next({message,status});

    }
}

const loginUser = async (req,res,next) =>{

    const {email,password} = req.body;
    if(!email || !password ||  email==="" || password ===""){
        next({status:400,message:"Field cannot be empty"});
    }

    try {

        const validUser = await User.findOne({email:email});

        if(!validUser){
            next({status:404,message:"User not found"});
        }
        const checkpass = await bcrypt.compare(password,validUser.password);
        if(checkpass){

            const token = jwt.sign(
                {id: validUser._id.toString(),email:validUser.email,isAdmin: validUser.isAdmin},
                process.env.PRIVATEKEY,
            )
        
            const {password,...rest} = validUser._doc;
            res.cookie("token",token,{httpOnly:true})

          return  res.status(200).json({message:"User Login Successful",rest})
        }else{

            next({message:"Invalid Credentials",extraDetails:"Check your email or password"})
            
        }

    } catch (error) {
        next(error);
    }
} 


const googleLogin = async( req,res,next) =>{

    try {
        const {username,email,googlePhotoURL} = req.body;

        const user = await User.findOne({email:email});
        if(user){
            const token = jwt.sign({id:user._id.toString(),email:user.email,isAdmin: user.isAdmin},process.env.PRIVATEKEY,);
            const {password,...rest} = user._doc;

            
            res.cookie("token",token,{httpOnly:true})
           return res.status(200).json({message:"Sign In successful",rest});
        }else{
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashPassword = await bcrypt.hash(generatePassword,10);

            const newUser = await User.create({
                username: username.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email,
                password:hashPassword,
                profilePicture:googlePhotoURL
            });
            
          const token = jwt.sign({id:newUser._id,email:newUser.email,isAdmin: newUser.isAdmin},process.env.PRIVATEKEY)

          const {password,...rest} = newUser._doc;
          return res.cookie("token",token,{
            httpOnly:true,

           }).status(200).json({message:"Sign In successful",rest});
        }
    } catch (error) {
        next(error);
    }
}

const signOutUser = async (req,res,next) =>{

    try {
        const token = req.cookies.token;

        if(!token){
    
            return next({message:"Unable to SignOut",extraDetails:"Token not verified",status:401});
        }
        return res.clearCookie('token').status(200).json({message:"User signOut Successfully"});
    } catch (error) {
        next(error);
    }
   

}

module.exports = {createUser,loginUser,googleLogin,signOutUser};
