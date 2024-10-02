const mongoose = require('mongoose')

const {Schema,model} = mongoose;


const User = new Schema({

    username: {
        type:String,
        required: true, 
        unique: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password: {
      type:String,
      required: true
    },
    profilePicture:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    timeStamp:{

    }
},{timestamps:true});


const usermodel = model('user',User);

module.exports = usermodel;