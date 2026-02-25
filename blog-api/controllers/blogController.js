const Blog = require("../models/Blog");
const Comment = require("../models/Comment")
const path = require("path")
const fs = require("fs")

//Get all posts : 
const getALLPost = async (req, res) => {
    try {
        const posts = await Blog.find({});

        res.status(200).json({ Message: "Posts", data: posts });

    } catch (err) {
        res.status(400).send(err.message);
    }
}


//Get singal posts : 
const getSingalPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Blog.find({ _id: postId });
        if (!post) {
            throw new Error("Post not found")
        }

        res.status(200).json({ Message: "Post found successfully", data: post });

    } catch (err) {
        res.status(400).send(err.message);
    }
}


//Create Post : 
const createPost = async (req, res) => {
    try {

        console.log(req.file)
        const { title, content, } = req.body;

        const user = req.user;

        const post = await new Blog({
            userId: user._id,
            title,
            content,
            mediaURL: req.file?.filename
        })

        await post.save();

        res.status(200).json({ Message: "Post successfull", data: post });

    } catch (err) {
        res.status(400).send(err.message);
    }
}

//Edit Post : 
const editPost = async (req, res) => {
    try {
        console.log(req.file)
        const post = await Blog.findOne({ _id: req.params.id });
        if (!post) {
            throw new Error("Blog not found");
        }

        const user = req.user;
        if (req.file) {
            const postMediaPath = path.join(__dirname, "../uploads", post.mediaURL);
            fs.unlink(postMediaPath, (err) => {
                if (err) {
                    console.log("Error : File not delete")
                }
            })
            req.body.mediaURL = req.file.filename;
        }

        if (post.userId.toString() !== user.id) {
            throw new Error("Unauthorised acceess");
        }

        const updatedPost = await Blog.findByIdAndUpdate({ _id: req.params.id },
            { $set: req.body },
            { returnDocument: "after" }
        )

        res.status(200).json({ Message: "Post successfull", data: updatedPost });

    } catch (err) {
        res.status(400).send(err.message);
    }
}

//Delete Post : 
const deletePost = async (req, res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id });
        if (!post) {
            throw new Error("Post not found");
        }

        const user = req.user;

        if (post.userId.toString() !== user.id) {
            throw new Error("Unauthorised acceess");
        }

        const postMediaPath = path.join(__dirname, "../uploads", post.mediaURL);
        fs.unlink(postMediaPath, (err) => {
            if (err) {
                console.log("Error : File not delete")
            }
        })

        const deletedPost = await Blog.findByIdAndDelete({ _id: req.params.id })

        res.status(200).json({ Message: "Post successfully deleted", data: deletedPost });

    } catch (err) {
        res.status(400).send(err.message);
    }
}


const handleLikeAndUnLike = async (req, res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id });
        if (!post) {
            throw new Error("Post Not Found");
        }

        const isUserAlreadyLiked = post.likes.includes(req.user.id);

        if (isUserAlreadyLiked) {
            const updatedPost = await Blog.findByIdAndUpdate(req.params.id, {
                $pull: { likes: req.user.id },
                $inc: { likeCount: -1 }
            }, { returnDocument: "after" })
            return res.status(200).json({ Message: "Post Unliked", data: updatedPost })
        } else {
            const updatedPost = await Blog.findByIdAndUpdate(req.params.id, {
                $addToSet: { likes: req.user.id },
                $inc: { likeCount: 1 }
            }, { returnDocument: "after" })
            return res.status(200).json({ Message: "Post Liked", data: updatedPost })
        }

    } catch (err) {
        res.status(400).send(err.message);
    }

}


const comment = async (req, res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id });
        if (!post) {
            throw new Error("Post Not Found");
        }

        const {text} = req.body;

        const comment = await Comment.create({
            postId:post.id,
            userId:req.user.id,
            text:text
        });

        await Blog.findByIdAndUpdate({_id:post.id},{
            $inc:{commentCount : 1}
        })

        res.status(200).json({Message:"Commentend successfully", data :comment})

    } catch (err) {
        res.status(400).send(err.message);
    }

}


const editComment = async (req, res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id });
        if (!post) {
            throw new Error("Post Not Found");
        }
        
        const comment = await Comment.findOne({_id:req.params.commentId});
        if(!comment){
            throw new Error("Comment Not Found");
        }

        if(comment.userId.toString() !== req.user.id){
            throw new Error("Unauthorised Acess");
        }

        const updatedComment = await Comment.findByIdAndUpdate({_id:comment.id},{
            text : req.body.text
        },{
            returnDocument:"after"
        })
        
        res.status(200).json({ Message: "Comment successfully updated", data: updatedComment });
        
        
    } catch (err) {
        res.status(400).send(err.message);
    }
    
}


const deleteComment = async (req, res) => {
    try {
       
        const post = await Blog.findOne({ _id: req.params.id });
        if (!post) {
            throw new Error("Post Not Found");
        }

        const comment = await Comment.findOne({_id:req.params.commentId});
        if(comment.userId.toString() !== req.user.id){
            throw new Error("Unauthorised Acess");
        }

        const deletedComment = await Comment.findByIdAndDelete({_id:req.params.commentId})

        res.status(200).json({Message:"Comment successfully deleted", data : deletedComment});

    } catch (err) {
        res.status(400).send(err.message);
    }

}


module.exports = { 
    getALLPost, 
    getSingalPost, 
    createPost, 
    editPost, 
    deletePost, 
    handleLikeAndUnLike,
    comment,
    editComment,
    deleteComment
};