
const jwt = require('jsonwebtoken');

const verifyToken = async (req,res,next) =>{

    const token = req.cookies.token;

    if(!token){

        return next({message:"User not verified",extraDetails:"Unauthorized",status:401});
    }

    jwt.verify(token,process.env.PRIVATEKEY,(err,user)=>{
        if(err){
            return next({status:401,message:"Unauthorized"});
        }

        req.user = user;
        next();
    })

}


module.exports = verifyToken;