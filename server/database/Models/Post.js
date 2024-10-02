const mongoose = require("mongoose");

const {Schema,model} = mongoose;



const adminSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    postImage:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2014/02/13/07/28/wordpress-265132_1280.jpg"
    },
    content:{
        type:String,
        required:true
    },
    slug:{
    type:String,
    required:true
    },
    userId:{
        type:String,
        required:true
    },
    timeStamp:{

    }
},{timestamps:true});

const postmodel = model('post',adminSchema);

module.exports = postmodel;