const { status } = require('http-status');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');
const { blogService } = require('../services');

// Get all posts
const getALLPost = catchAsync(async (req, res) => {
  const posts = await blogService.getALLPost();
  if (!posts || posts.length === 0) {
    throw new CustomError('No posts found', status.NOT_FOUND); // If no posts are found, throw 404 error
  }
  res.status(status.OK).json({ message: 'Posts fetched successfully', data: posts });
});

// Get single post
const getSinglePost = catchAsync(async (req, res) => {
  const post = await blogService.getPostById(req.params.id);
  if (!post) {
    throw new CustomError('Post not found', status.NOT_FOUND); // Throw error if post not found
  }
  res.status(status.OK).json({ message: 'Post found successfully', data: post });
});

// Create post
const createPost = catchAsync(async (req, res) => {
  const { title, content } = req.body;

  // Check if required fields are missing
  if (!title || !content) {
    throw new CustomError('Title and content are required', status.BAD_REQUEST); // Throw 400 if fields are missing
  }

  if (!req.file) {
    throw new CustomError('Media is required', status.BAD_REQUEST);
  }

  const post = await blogService.createPost({
    userId: req.user._id,
    title,
    content,
    mediaURL: req.file?.filename,
  });

  res.status(status.CREATED).json({
    message: 'Post created successfully',
    data: post,
  });
});

// Edit post
const editPost = catchAsync(async (req, res) => {
  const post = await blogService.editPost({
    postId: req.params.id,
    userId: req.user._id,
    body: req.body,
    file: req.file,
  });

  if (!post) {
    throw new CustomError('Post not found or unauthorized', status.NOT_FOUND); // Throw error if post is not found or unauthorized
  }

  res.status(status.OK).json({ message: 'Post updated successfully', data: post });
});

// Delete post
const deletePost = catchAsync(async (req, res) => {
  const post = await blogService.deletePost({
    postId: req.params.id,
    userId: req.user._id,
  });

  if (!post) {
    throw new CustomError('Post not found or unauthorized', status.NOT_FOUND); // Throw error if post is not found
  }

  res.status(status.OK).json({ message: 'Post deleted successfully', data: post });
});

// Toggle like
const toggleLike = catchAsync(async (req, res) => {
  const post = await blogService.toggleLike({
    postId: req.params.id,
    userId: req.user._id,
  });

  if (!post) {
    throw new CustomError('Post not found', status.NOT_FOUND); // Throw error if post not found
  }

  res.status(status.OK).json({
    message: post.likes.includes(req.user._id) ? 'Post Liked' : 'Post Unliked',
    data: post,
  });
});

// Add comment
const addComment = catchAsync(async (req, res) => {
  if (!req.body.text) {
    throw new CustomError('Comment text is required', status.BAD_REQUEST); // Throw error if text is missing in comment
  }

  const comment = await blogService.addComment({
    postId: req.params.id,
    userId: req.user._id,
    text: req.body.text,
  });

  res.status(status.CREATED).json({ message: 'Comment added successfully', data: comment });
});

// Add comment on comment
const addCommentOnComment = catchAsync(async (req, res) => {
  if (!req.body.text) {
    throw new CustomError('Comment text is required', status.BAD_REQUEST); // Throw error if text is missing in comment
  }

  const comment = await blogService.addCommentOnComment({
    postId: req.params.id,
    userId: req.user._id,
    text: req.body.text,
    parentCommentId: req.params.commentId,
  });
  res
    .status(status.CREATED)
    .json({ message: 'Comment added on comment successfully', data: comment });
});

// Get all comments with post ID
const getAllCommentWithPostId = catchAsync(async (req, res) => {
  const comments = await blogService.getAllCommentWithPostId(req.params.id);
  if (!comments || comments.length === 0) {
    return res.status(status.OK).json({ message: 'Comments not avilable', data: comments });
  }

  const map = {};
  const arr = [];

  comments.forEach((element) => {
    map[element.id] = { ...element.toObject(), replies: [] };
  });

  comments.forEach((element) => {
    if (element.parentCommentId) {
      map[element.parentCommentId].replies.push(map[element.id]);
    } else {
      arr.push(map[element.id]);
    }
  });

  res.status(status.OK).json({ message: 'Comments fetched successfully', data: arr });
});

// Edit comment
const editComment = catchAsync(async (req, res) => {
  const comment = await blogService.editComment({
    commentId: req.params.commentId,
    userId: req.user._id,
    text: req.body.text,
  });

  if (!comment) {
    throw new CustomError('Comment not found or unauthorized', status.NOT_FOUND); // Throw error if comment not found
  }

  res.status(status.OK).json({ message: 'Comment updated successfully', data: comment });
});

// Delete comment
const deleteComment = catchAsync(async (req, res) => {
  const comment = await blogService.deleteComment({
    commentId: req.params.commentId,
    userId: req.user._id,
  });

  if (!comment) {
    throw new CustomError('Comment not found or unauthorized', status.NOT_FOUND); // Throw error if comment not found
  }

  res.status(status.OK).json({ message: 'Comment deleted successfully', data: comment });
});

module.exports = {
  getALLPost,
  getSinglePost,
  createPost,
  editPost,
  deletePost,
  toggleLike,
  addComment,
  addCommentOnComment,
  editComment,
  deleteComment,
  getAllCommentWithPostId,
};
