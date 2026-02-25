const express = require("express");
const blogCotroller = require("../controllers/blogController");
const multerUpload = require("../middlewares/multerMiddleware")
const authMiddleware = require("../middlewares/authMiddleware");


const blogRouter = express();

blogRouter.get("/", blogCotroller.getALLPost);
blogRouter.get("/:id", blogCotroller.getSingalPost);
blogRouter.post("/", authMiddleware, multerUpload.single("Uploaded_file_name"),blogCotroller.createPost);
blogRouter.put("/:id", authMiddleware, multerUpload.single("Uploaded_file_name"), blogCotroller.editPost);
blogRouter.delete("/:id", authMiddleware, blogCotroller.deletePost);

module.exports = blogRouter;