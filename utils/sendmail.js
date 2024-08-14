const nodemailer = require('nodemailer');

//For generating random OTP
exports.sendMail = async (req, res, user) => {
  const OTP = Math.floor(1000 + Math.random() * 9000);

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // Replace with your email provider
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // Setup email data
  const mailOptions = {
    from: '"Premlata" <kkpremlata2607@gmail.com>', // Sender address
    to: req.body.email, // List of recipients
    subject: "Password Reset Link", // Subject line
    text: "Donot share this OTP with anyone", // Plain text body
    html: `
    <h1>Password Reset OTP</h1>
    <h3>OTP:${OTP}</h3>`, // HTML body
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) return res.send(error);
    console.log(info);
    user.otp = OTP;
    await user.save();

    return res.redirect(`/verify-otp/${user._id}`);
  });
};
