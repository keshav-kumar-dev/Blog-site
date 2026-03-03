const express = require('express');
const validate = require('../middlewares/validate');

const blogCotroller = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');
const multerUpload = require('../middlewares/multerMiddleware');
const { blogValidation } = require('../validations');

const blogRouter = express();

blogRouter.get('/', blogCotroller.getALLPost);
blogRouter.get('/:id', validate(blogValidation.getBlog), blogCotroller.getSinglePost);
blogRouter.post(
  '/',
  authMiddleware,
  validate(blogValidation.createBlog),
  multerUpload.single('Uploaded_file_name'),
  blogCotroller.createPost
);
blogRouter.put(
  '/:id',
  authMiddleware,
  validate(blogValidation.updateBlog),
  multerUpload.single('Uploaded_file_name'),
  blogCotroller.editPost
);
blogRouter.delete(
  '/:id',
  authMiddleware,
  validate(blogValidation.deleteBlog),
  blogCotroller.deletePost
);
blogRouter.post('/:id/like', authMiddleware, blogCotroller.toggleLike);

blogRouter.patch('/:id/comment/:commentId', authMiddleware, blogCotroller.editComment);
blogRouter.delete('/:id/comment/:commentId/', authMiddleware, blogCotroller.deleteComment);
blogRouter.post('/:id/comment/', authMiddleware, blogCotroller.addComment);

module.exports = blogRouter;
