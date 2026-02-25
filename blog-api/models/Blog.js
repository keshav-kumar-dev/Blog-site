const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:[5, "Title must be at least 5 character long"],
        maxlength:[100, "Title must be less than 100 character long"],
    },
    content:{
        type:String,
        required:true,
        minlength:[100, "Content must be at least 100 character long"],
    },
    mediaURL:{
        type:String,
        trim:true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    likeCount:{
        type:Number,
        default:0
    },
    commentCount:{
        type:Number,
        default:0
    }
},
{
    timestamps : true
})


const Blog = new mongoose.model("Blog", blogSchema);
module.exports = Blog;