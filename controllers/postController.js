const PostCollection = require("../models/postschema");
const imagekit = require("../utils/imagekit");

exports.CreatePostPage = async (req, res, next) => {
  try {
    res.render("createpost", {
      title: "Create Post | SocialMedia",
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};

exports.CreatePost = async (req, res, next) => {
  console.log(req.body);
  try {
    const newPost = new PostCollection(req.body);

    const { fileId, url, thumbnailUrl } = await imagekit.upload({
      file: req.files.media.data,
      fileName: req.files.media.name,
    });

    newPost.media = { fileId, url, thumbnailUrl };
    newPost.user = req.user._id;

    req.user.posts.push(newPost._id);

    await newPost.save();
    await req.user.save();
    res.redirect("/user/profile");
    // res.send("Post Created!");
    // res.send(newPost);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};

exports.PostLike = async (req, res, next) => {
  try {
    const post = await PostCollection.findById(req.params.pid);
    if (post.likes.includes(req.user._id)) {
      const uidx = post.likes.indexOf(req.user._id);
      post.likes.splice(uidx, 1);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.redirect("/user/profile");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
