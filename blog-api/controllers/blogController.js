const Blog = require("../models/Blog");

const path = require("path")
const fs = require("fs")

//Get all posts : 
const getALLPost = async (req,res)=>{
    try{
        const posts = await Blog.find({});

        res.status(200).json({Message : "Posts", data:posts});

    }catch(err){
        res.status(400).send(err.message);
    }
}


//Get singal posts : 
const getSingalPost =  async (req,res)=>{
    try{
        const postId = req.params.id;

        const post = await Blog.find({_id:postId});
        if(!post){
            throw new Error("Post not found")
        }

        res.status(200).json({Message : "Post found successfully", data:post});

    }catch(err){
        res.status(400).send(err.message);
    }
}


//Create Post : 
const createPost = async (req,res)=>{
    try{

        console.log(req.file)
        const {title,content,} = req.body;

        const user = req.user;

        const post = await new Blog({
            userId  : user._id,
            title,
            content,
            mediaURL:req.file?.filename
        })

        await post.save();

        res.status(200).json({Message : "Post successfull", data:post});

    }catch(err){
        res.status(400).send(err.message);
    }
}


//Edit Post : 
const editPost = async (req,res)=>{
    try{
        console.log(req.file)
        const post = await Blog.findOne({_id:req.params.id});
        if(!post){
            throw new Error("Blog not found");
        }

        const user = req.user;
        if(req.file){
            const postMediaPath = path.join(__dirname,"../uploads",post.mediaURL);
            fs.unlink(postMediaPath,(err)=>{
                if(err){
                console.log("Error : File not delete")
            }
            })
            req.body.mediaURL = req.file.filename;
        }

        if(post.userId.toString() !== user.id){
            throw new Error("Unauthorised acceess");
        }

        const updatedPost = await Blog.findByIdAndUpdate({_id: req.params.id}, 
            {$set:req.body},
            {returnDocument:"after"}
        )

        res.status(200).json({Message : "Post successfull", data:updatedPost});

    }catch(err){
        res.status(400).send(err.message);
    }
}

//Delete Post : 
const deletePost = async (req,res)=>{
    try{
        const post = await Blog.findOne({_id:req.params.id});
        if(!post){
            throw new Error("Post not found");
        }

        const user = req.user;

        if(post.userId.toString() !== user.id){
            throw new Error("Unauthorised acceess");
        }

        const postMediaPath = path.join(__dirname,"../uploads",post.mediaURL);
            fs.unlink(postMediaPath,(err)=>{
                if(err){
                console.log("Error : File not delete")
            }
            })

        const deletedPost = await Blog.findByIdAndDelete({_id: req.params.id})

        res.status(200).json({Message : "Post successfully deleted", data:deletedPost});

    }catch(err){
        res.status(400).send(err.message);
    }
}

module.exports = {getALLPost,getSingalPost,createPost,editPost,deletePost};