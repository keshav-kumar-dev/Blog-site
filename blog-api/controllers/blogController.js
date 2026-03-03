const catchAsync = require('../utils/catchAsync');
const { blogService } = require('../services');

//Get all posts :
const getALLPost = catchAsync(async (req, res) => {
  const posts = await blogService.getALLPost();
  res.status(200).json({ Message: 'Posts', data: posts });
});

//Get singal posts :
const getSinglePost = catchAsync(async (req, res) => {
  const post = await blogService.getPostById(req.params.id);
  res.status(200).json({ message: 'Post found successfully', data: post });
});

//Create Post :
const createPost = catchAsync(async (req, res) => {
  const { title, content } = req.body;

  const post = await blogService.createPost({
    userId: req.user._id,
    title,
    content,
    mediaURL: req.file?.filename,
  });

  res.status(200).json({
    message: 'Post successful',
    data: post,
  });
});

//Edit Post :
const editPost = catchAsync(async (req, res) => {
  const post = await blogService.editPost({
    postId: req.params.id,
    userId: req.user._id,
    body: req.body,
    file: req.file,
  });
  res.status(200).json({ message: 'Post updated successfully', data: post });
});

const deletePost = catchAsync(async (req, res) => {
  const post = await blogService.deletePost({
    postId: req.params.id,
    userId: req.user._id,
  });
  res.status(200).json({ message: 'Post deleted successfully', data: post });
});

const toggleLike = catchAsync(async (req, res) => {
  const post = await blogService.toggleLike({
    postId: req.params.id,
    userId: req.user._id,
  });
  res.status(200).json({
    message: post.likes.includes(req.user._id) ? 'Post Liked' : 'Post Unliked',
    data: post,
  });
});

const addComment = catchAsync(async (req, res) => {
  const comment = await blogService.addComment({
    postId: req.params.id,
    userId: req.user._id,
    text: req.body.text,
  });
  res.status(200).json({ message: 'Comment added successfully', data: comment });
});

const editComment = catchAsync(async (req, res) => {
  const comment = await blogService.editComment({
    commentId: req.params.commentId,
    userId: req.user._id,
    text: req.body.text,
  });
  res.status(200).json({ message: 'Comment updated successfully', data: comment });
});

const deleteComment = catchAsync(async (req, res) => {
  const comment = await blogService.deleteComment({
    postId: req.params.id,
    commentId: req.params.commentId,
    userId: req.user._id,
  });
  res.status(200).json({ message: 'Comment deleted successfully', data: comment });
});

module.exports = {
  getALLPost,
  getSinglePost,
  createPost,
  editPost,
  deletePost,
  toggleLike,
  addComment,
  editComment,
  deleteComment,
};
