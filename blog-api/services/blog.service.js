const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');
const Comment = require('../models/Comment');

const createPost = async ({ userId, title, content, mediaURL }) => {
  const post = await Blog.create({
    userId,
    title,
    content,
    mediaURL,
  });

  return post;
};

const getALLPost = async () => {
  return await Blog.find({});
};

const getPostById = async (postId) => {
  const post = await Blog.findById(postId);
  if (!post) throw new Error('Post not found');
  return post;
};

const editPost = async ({ postId, userId, body, file }) => {
  const post = await Blog.findById(postId);
  if (!post) throw new Error('Blog not found');

  if (post.userId.toString() !== userId.toString()) {
    throw new Error('Unauthorized access');
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

const deletePost = async ({ postId, userId }) => {
  const post = await Blog.findById(postId);
  if (!post) throw new Error('Post not found');

  if (post.userId.toString() !== userId.toString()) {
    throw new Error('Unauthorized access');
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

const toggleLike = async ({ postId, userId }) => {
  const post = await Blog.findById(postId);
  if (!post) throw new Error('Post not found');

  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    return Blog.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId }, $inc: { likeCount: -1 } },
      { returnDocument: 'after' }
    );
  } else {
    return Blog.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId }, $inc: { likeCount: 1 } },
      { returnDocument: 'after' }
    );
  }
};

// Add comment
const addComment = async ({ postId, userId, text }) => {
  const post = await Blog.findById(postId);
  if (!post) throw new Error('Post not found');

  const comment = await Comment.create({ postId, userId, text });
  await Blog.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
  return comment;
};

// Edit comment
const editComment = async ({ commentId, userId, text }) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');

  if (comment.userId.toString() !== userId.toString()) {
    throw new Error('Unauthorized access');
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { text },
    { returnDocument: 'after' }
  );
  return updatedComment;
};

// Delete comment
const deleteComment = async ({ postId, commentId, userId }) => {
  const post = await Blog.findById(postId);
  if (!post) throw new Error('Post not found');

  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');

  if (comment.userId.toString() !== userId.toString()) {
    throw new Error('Unauthorized access');
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  await Blog.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });

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
};
