const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
// const imagekit = require("../utils/imagekit");
// const PostCollection = require("../models/postschema");

const {
  CreatePostPage,
  CreatePost,
  PostLike,
} = require("../controllers/postController");

/**
 * @routes get/post/create-post
 * @desc Render create post page
 * @access Private
 */

router
  .route("/create-post")
  .get(isLoggedIn, CreatePostPage)
  .post(isLoggedIn, CreatePost); //we combined "/create-post" route of "get" & "post"(This is the precise way to write code)

// router.route("/create-post").get(isLoggedIn,CreatePostPage);    //we can write in this way also
// router.get("/create-post", isLoggedIn,CreatePostPage);

// router.post("/create-post", isLoggedIn, CreatePost);

router.get("/like/:pid", isLoggedIn, PostLike);

module.exports = router;
