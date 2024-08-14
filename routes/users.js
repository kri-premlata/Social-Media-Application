var express = require("express");
var router = express.Router();
var path = require("path");

const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const passport = require("passport");
const LocalStategy = require("passport-local");
const UserCollection = require("../models/userschema");
const { isLoggedIn } = require("../middleware/auth");
const { sendMail } = require("../utils/sendmail");
const imagekit = require("../utils/imagekit");
const PostCollection = require("../models/postschema");



passport.use(new LocalStategy(UserCollection.authenticate()));

router.post("/register", async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    await UserCollection.register({ username, email }, password);
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user/profile",
    failureRedirect: "/login",
  }),
  (req, res, next) => {}
);

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const posts = await PostCollection.find().populate("user");
    console.log(posts);
    res.render("profile", {
      title: "Profile | SocialMedia",
      user: req.user,
      posts: posts,
    });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

//---------SENDING-MAIL---------------------
router.post("/send-mail", async (req, res, next) => {
  try {
    const user = await UserCollection.findOne({ email: req.body.email });
    if (!user)
      return res.send(
        "No user found with this email. <a href='/forget-password'>Try Again</a>"
      );
    await sendMail(req, res, user);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

//---------VERIFY-OTP-----------------
router.post("/verify-otp:id", async (req, res, next) => {
  try {
    const user = await UserCollection.findById(req.params.id);
    if (!user) return res.send("No User Found.");
    if (user.otp != req.body.otp) {
      user.otp = 0;
      await user.save();
      return res.send("Invalid OTP, <a href='/forget-password'>Try Again</a>");
    }
    user.otp = 0;
    await user.setPassword(req.body.password);
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

router.get("/settings", isLoggedIn, async (req, res, next) => {
  try {
    const userAndPosts = await req.user.populate("posts"); //aggregation pipeline for getting posts of user
    res.render("settings", {
      title: "Setting | SocialMedia",
      user: userAndPosts,
    });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

//--------------CODE FOR UPLOAD & SAVE IMAGE---------------------------
router.post("/avatar/:id", isLoggedIn, async (req, res, next) => {
  try {
    const { fileId, url, thumbnailUrl } = await imagekit.upload({
      file: req.files.avatar.data,
      fileName: req.files.avatar.name,
      // fileName: Date.now() + path.extname(req.files.avatar.name),
    });
    if (req.user.avatar.fileId) {
      await imagekit.deleteFile(req.user.avatar.fileId); //delete old file if file is there
    }

    // --------------CODE TO UPDATE IMAGE (avatar)-------------------------
    // console.log(result);
    // const user = await UserCollection.findById(req.user._id);
    // if(!user) return res.send("No User found.");
    // user.avatar = result.url;
    // await user.save();

    // ------update new file----------------------
    req.user.avatar = { fileId, url, thumbnailUrl };
    await req.user.save();

    res.redirect("/user/settings");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
  async (error, response) => {
    if (error) {
      console.log(error);
      res.send(error.message);
    }
  };
});

//----------DELETE USER------------------
//deleting user
router.get("/delete/:id", isLoggedIn, async (req, res, next) => {
  try {
    const user = await UserCollection.findByIdAndDelete(req.params.id);
    await imagekit.deleteFile(user.avatar.fileId);

    // deleting user post
    await user.posts.forEach(async (post) => {
      const deletedPost = await PostCollection.findByIdAndDelete(post);
      await imagekit.deleteFile(deletedPost.media.fileId);
    });
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

//---------UPDATE USER--------------------
router.post("/update/:id", isLoggedIn, async (req, res, next) => {
  try {
    await UserCollection.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/user/settings");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

//--------Reset Password--------------------
router.get("/reset-password/:id", isLoggedIn, (req, res, next) => {
  res.render("resetpassword", {
    title: "Reset Password | SocialMedia",
    user: req.user,
  });
});

router.post("/reset-password/:id", isLoggedIn, async (req, res, next) => {
  try {
    await req.user.changePassword(req.body.oldPassword, req.body.newPassword);
    await req.user.save();
    res.redirect("/user/settings");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

router.get("/chat", isLoggedIn, async (req, res, next) => {
  try {
    const users = await UserCollection.find({
      _id: { $ne: req.user._id }, //ne: means not equal, here it is comparing "user" is not equal to "loggedIn user".
    });
    res.render("chat", { title: "Chat | SocialMedia", user: req.user, users });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

router.post("/create-order", isLoggedIn, async (req, res, next) => {
  console.log(req.body);
try {
  var options = {
    amount: 5000 * 100, // amount in the smallest currency unit
    currency: "INR", //it could be USD,PKR,YAN (It is for country currency name)
    // receipt: "order_rcptid_11"
  };
  const order = await instance.orders.create(options,);
    console.log(order);         //console order details
    res.json(order);
} catch (error) {
  console.log(error);
  res.send(error.message);
}
});

router.post("/payment/verify", isLoggedIn, async (req,res,next)=>{
  const razorpaySignature = req.body.signature;
  const orderId = req.body.order_id;
  const paymentId = req.body.payment_id;
  const secret = process.env.KEY_SECRET;

  try {
    var {validatePaymentVerification} = require('../node_modules/razorpay/dist/utils/razorpay-utils');
    const result = validatePaymentVerification({
      "order_id":orderId,
      "payment_id": paymentId,
    }, razorpaySignature , secret);

    if(result){
      await UserCollection.findByIdAndUpdate(req.user._id,{isPremium:true});
      console.log("Payment Successful");
      res.send("Payment Successful!");
    }else{
      console.log("Payment Failed")
      res.send("Payment Failed!");
    }
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
})
module.exports = router;
