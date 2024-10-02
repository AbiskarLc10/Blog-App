const mongoose = require('mongoose');

const {Schema,model} = mongoose;



const CommentSchema = new Schema({

    content:{
        type:String,
        required:true
    },
    postId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    likes:{
        type:Array,
        default:[]
    },
    numberofLikes:{
        type:Number,
        default:0
    }
},{timestamps:true});


const commentmodel = model('comment',CommentSchema);

module.exports = commentmodel;