var express = require("express");
const PostCollection = require("../models/postschema");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const posts = await PostCollection.find().populate("user");
  res.render("index", { title: "Home | SocialMedia", user: req.user, posts:posts });
  
} catch (error) {
  console.log(error);
  res.send(error.message) 
}
});

router.get("/about", (req, res, next) => {
  res.render("about", { title: "About | SocialMedia", user: req.user });
});

router.get("/contact", (req, res, next) => {
  res.render("contact", { title: "Contact | SocialMedia", user: req.user });
});

router.get("/login", (req, res, next) => {
  res.render("login", { title: "Login | SocialMedia", user: req.user });
});

router.get("/register", (req, res, next) => {
  res.render("register", { title: "Register | SocialMedia", user: req.user });
});
router.get("/forget-password", (req, res, next) => {
  res.render("forgetPassword", {
    title: "Forget Password | SocialMedia",
    user: req.user,
  });
});

router.get("/verify-otp/:id", (req, res, next) => {
  res.render("forgetOTP", {
    title: "Verify OTP | SocialMedia",
    user: req.user,
    id: req.params.id,
  });
});

module.exports = router;
