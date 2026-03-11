const mongoose = require('mongoose');

const Blog = require('./Blog');
const User = require('./User');

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Blog,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Comment cannot be empty'],
      trim: true,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    parentPath: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = new mongoose.model('Comment', commentSchema);

module.exports = Comment;
