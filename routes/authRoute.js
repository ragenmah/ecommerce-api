const express = require("express");

const {
  userRegister,
  postEmailConfirmation,
  signIn,
  signOut,
  forgetPassword,
  resetPassword,
  userList,
  userDetails,
  resendEmailVerificationLink,
  requireSignin,
} = require("../controllers/authController");
const router = express.Router();
const errorHandler = require("../helpers/errorHandler");

router.post("/register", userRegister);
router.post("/confirmation/:token", postEmailConfirmation);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:token", resetPassword);
router.get("/userlist", requireSignin, errorHandler, userList);
router.get("/userdetails/:id", requireSignin, userDetails);
router.post("/resendverificationmail", resendEmailVerificationLink);
module.exports = router;
