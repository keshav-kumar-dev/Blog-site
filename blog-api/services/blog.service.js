const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');
const Comment = require('../models/Comment');
const { getIO } = require('../services/socket');
const { status } = require('http-status');
const CustomError = require('../utils/CustomError'); // Import CustomError

// Create Post
const createPost = async ({ userId, title, content, mediaURL }) => {
  const post = await Blog.create({
    userId,
    title,
    content,
    mediaURL,
  });

  return post;
};

// Get All Posts
const getALLPost = async () => {
  return await Blog.find({}).sort({ createdAt: -1 }).populate('userId', 'name photoURL');
};

// Get Post by ID
const getPostById = async (postId) => {
  const post = await Blog.findById(postId);
  if (!post) throw new CustomError('Post not found', status.NOT_FOUND); // Use CustomError with 404 status
  return post;
};

// Edit Post
const editPost = async ({ postId, userId, body, file }) => {
  const post = await Blog.findById(postId);
  if (!post) throw new CustomError('Blog not found', status.NOT_FOUND); // Use CustomError with 404 status

  if (post.userId.toString() !== userId.toString()) {
    throw new CustomError('Unauthorized access', status.FORBIDDEN); // Unauthorized access error with 403 status
  }

  // Handle file
  if (file) {
    if (post.mediaURL) {
      const postMediaPath = path.join(__dirname, '../uploads', post.mediaURL);
      fs.unlink(postMediaPath, (err) => {
        if (err) console.log('Error deleting file');
      });
    }
    body.mediaURL = file.filename;
  }

  const updatedPost = await Blog.findByIdAndUpdate(
    postId,
    { $set: body },
    { returnDocument: 'after' }
  );
  return updatedPost;
};

// Delete Post
const deletePost = async ({ postId, userId }) => {
  const post = await Blog.findById(postId);
  if (!post) throw new CustomError('Post not found', status.NOT_FOUND); // Use CustomError with 404 status

  if (post.userId.toString() !== userId.toString()) {
    throw new CustomError('Unauthorized access', status.FORBIDDEN); // Unauthorized access error with 403 status
  }

  // Delete media file
  if (post.mediaURL) {
    const postMediaPath = path.join(__dirname, '../uploads', post.mediaURL);
    fs.unlink(postMediaPath, (err) => {
      if (err) console.log('Error deleting file');
    });
  }

  const deletedPost = await Blog.findByIdAndDelete(postId);
  return deletedPost;
};

// Toggle Like
const toggleLike = async ({ postId, userId }) => {
  const io = getIO();
  const post = await Blog.findById(postId);
  if (!post) throw new CustomError('Post not found', status.NOT_FOUND); // Use CustomError with 404 status

  const alreadyLiked = post.likes.includes(userId);
  let updatedPost = '';
  if (alreadyLiked) {
    updatedPost = await Blog.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId }, $inc: { likeCount: -1 } },
      { returnDocument: 'after' }
    );
  } else {
    updatedPost = await Blog.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId }, $inc: { likeCount: 1 } },
      { returnDocument: 'after' }
    );
  }

  io.emit('updatedLikeCount', { postId, likeCount: updatedPost.likeCount });

  return updatedPost;
};

// Add Comment
const addComment = async ({ postId, userId, text, user }) => {
  const io = getIO();
  const post = await Blog.findById(postId);
  if (!post) throw new CustomError('Post not found', status.NOT_FOUND); // Use CustomError with 404 status

  const comment = await Comment.create({ postId, userId, text });
  await Blog.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
  await comment.populate('userId', 'name');

  io.emit('newComment', { postId, comment });

  return comment;
};

// Edit Comment
const editComment = async ({ commentId, userId, text }) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new CustomError('Comment not found', status.NOT_FOUND); // Use CustomError with 404 status

  if (comment.userId.toString() !== userId.toString()) {
    throw new CustomError('Unauthorized access', status.FORBIDDEN); // Unauthorized access error with 403 status
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { text },
    { returnDocument: 'after' }
  );
  return updatedComment;
};

// Get All Comments for a Post
const getAllCommentWithPostId = async (postId) => {
  return await Comment.find({ postId }).populate('userId', 'name').sort({ createdAt: -1 });
};

// Delete Comment
const deleteComment = async ({ commentId, userId }) => {
  const io = getIO();
  const comment = await Comment.findById(commentId);
  if (!comment) throw new CustomError('Comment not found', status.NOT_FOUND); // Use CustomError with 404 status

  if (comment.userId.toString() !== userId.toString()) {
    throw new CustomError('Unauthorized access', status.FORBIDDEN); // Unauthorized access error with 403 status
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  const updatedPost = await Blog.findByIdAndUpdate(
    comment.postId,
    { $inc: { commentCount: -1 } },
    { returnDocument: 'after' }
  );
  io.emit('commentDeleted', {
    postId: comment.postId,
    commentId: comment._id,
    updatedPostCommentCount: updatedPost.commentCount,
  });

  return deletedComment;
};

module.exports = {
  createPost,
  getALLPost,
  getPostById,
  editPost,
  deletePost,
  toggleLike,
  addComment,
  editComment,
  deleteComment,
  getAllCommentWithPostId,
};
