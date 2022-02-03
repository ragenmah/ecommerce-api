const User = require("../models/authModel");
const Token = require("../models/tokenModel");
const sendEmail = require("../utils/setMail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken"); //authentication
const expressJwt = require("express-jwt");
//authorization kun page ma jaane or na jaane

//register user
exports.userRegister = async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //check for unique email
  User.findOne({ email: user.email }, async (error, data) => {
    if (data == null) {
      user = await user.save();
      if (!user) {
        return res.status(400).json({ error: "something went wrong" });
      }

      let token = new Token({
        token: crypto.randomBytes(16).toString("hex"),
        userId: user._id,
      });
      token = await token.save();
      if (!token) {
        return res.status(400).json({ error: "failed to store token" });
      }
      //send email
      sendEmail({
        from: "no-reply@ecommerce-api.com",
        to: user.email,
        subject: "Email Verification link",
        text: `Hello! \n\n Please verify your email by clicking the link below: \n\n
    http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}
    `,
      });
      // http://localhost:5000/api/confirmation/58abc452

      res.send(user);
    } else {
      return res.status(400).json({ error: "email must be unique" });
    }
  });
};

//confirmation of mail
exports.postEmailConfirmation = (req, res) => {
  //at first find the valid token or matching token
  Token.findOne({ token: req.params.token }, (error, token) => {
    if (error || !token) {
      return res
        .status(400)
        .json({ error: "invalid token or token have been expired" });
    }
    //if we find thevalid tokenthen find the valid user for that token

    User.findOne({ _id: token.userId }, (error, user) => {
      if (error || !user) {
        return res.status(400).json({
          error: "sorry we are unable to find valid user for this token",
        });
      }
      // json wb token authentication ko laagi and authorization ko express jwt
      //if user is already verified
      if (user.isVerified) {
        return res
          .status(400)
          .json({ error: "Email is already verified, login to continue" });
      }
      // save verified user
      user.isVerified = true;
      user.save((error) => {
        if (error) {
          return res.status(400).json({ error: error });
        }
        res.json({ message: "congratss! Your email has been verified" });
      });
    });
  });
};

//sign in process
exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  // const email =req.body.email
  // const password= req.body.password

  //first cheeck if email is registered or not
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(403)
      .json({ error: "sorry your email isnot found in our system" });
  }
  // if email found then check the matching password for that email
  if (!user.authenticate(password)) {
    return res.status(400).json({ error: "email and password doesnot match" });
  }
  //check if user is verified or not
  if (!user.isVerified) {
    return res
      .status(400)
      .json({ error: "please verify your email first to continue" });
  }
  // now genereate token  with user id and jwt secret
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  // store token in cookie
  res.cookie("helloCookie", token, { expire: Date.now() + 999999 });

  //return user information to frontend
  const { _id, name, role } = user; //user._id use garna naparos vanera ho
  return res.json({ token, user: { name, email, role, _id } });
};

//sign out
exports.signOut = (req, res) => {
  res.clearCookie("helloCookie");
  res.json({ message: "signout success" });
};

//forget password
exports.forgetPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(403)
      .json({ error: "sorry your email is not found in our system" });
  }

  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });

  token = await token.save();
  if (!token) {
    return res.status(400).json({ error: "something went wrong" });
  }
  //send email
  sendEmail({
    from: "no-reply@ecommerce-api.com",
    to: user.email,
    subject: "Password Reset link",
    text: `Hello! \n\n Please reset your password by clicking the link below: \n\n
    http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}
    `,
  });
  // http://localhost:5000/api/confirmation/58abc452

  res.json({ messsage: "Password reset link has been sent" });
};

//reset password
exports.resetPassword = async (req, res) => {
  //at first find valid token
  let token = await Token.findOne({
    token: req.params.token,
  });
  if (!token) {
    return res.status(403).json({
      error: "invalid token or token may have expired",
    });
  }
  //if token found then find the valid user for that roken
  let user = await User.findOne({
    _id: token.userId,
    email: req.body.email,
  });

  if (!user) {
    return res.status(400).json({
      error:
        "sorry the email you provided not associated with this token please try another registeration",
    });
  }
  user.password = req.body.password;
  user = await user.save();
  if (!user) {
    return res.status(400).json({ error: "failed to reset password" });
  }
  res.json({ message: "password has been reset successfully " });
};

//user list
exports.userList = async (req, res) => {
  const user = await User.find().select("-hashed_password"); //hashed password not to show
  if (!user) {
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send(user);
};

//single user
exports.userDetails = async (req, res) => {
  const user = await User.findById(req.params.id).select("-hashed_password");
  if (!user) {
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send(user);
};

//resend email verification link
exports.resendEmailVerificationLink = async (req, res) => {
  //at first find the registered users
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(403)
      .json({ error: "sorry your email is not found in our system" });
  }

  //check if already verified
  if (user.isVerified) {
    return res.status(400).json({
      error: "email is already verified, log in to continue",
    });
  }
  // create token to store in database and send to verification link
  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });

  token = await token.save();
  if (!token) {
    return res.status(400).json({ error: "something went wrong" });
  }

  //send email
  sendEmail({
    from: "no-reply@ecommerce-api.com",
    to: user.email,
    subject: "Email verificaiton link",
    text: `Hello! \n\n Please reset your password by clicking the link below: \n\n
    http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}
    `,
  });
  // http://localhost:5000/api/confirmation/58abc452
  res.json({ message: "verification link have been sent" });
  // res.send(user);
};

// for authorization
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
