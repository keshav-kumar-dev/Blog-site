const Joi = require('joi');
const { objectId } = require('./custom.validation');

//   Create Blog Validation

const createBlog = {
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),

    title: Joi.string().trim().min(5).max(100).required(),

    content: Joi.string().min(100).required(),

    mediaURL: Joi.string().uri().optional(),

    // Prevent client from sending these
    likes: Joi.forbidden(),
    likeCount: Joi.forbidden(),
    commentCount: Joi.forbidden(),
  }),
};

//   Update Blog Validation

const updateBlog = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),

  body: Joi.object()
    .keys({
      title: Joi.string().trim().min(5).max(100),
      content: Joi.string().min(100),
      mediaURL: Joi.string().trim().uri(),
    })
    .min(1), // at least one field must be updated
};

/**
 * Get Single Blog Validation
 */
const getBlog = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

/**
 * Delete Blog Validation
 */
const deleteBlog = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  deleteBlog,
};
