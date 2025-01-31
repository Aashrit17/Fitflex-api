const asyncHandler = require("../middleware/async");
const user = require("../models/user");
const path = require("path");
const fs = require("fs");



// @desc    Create new user
// @route   POST /api/v1/auth/register
// @access  Public

exports.register = asyncHandler(async (req, res, next) => {
  const existingUser = await user.findOne({ email: req.body.email });
  console.log(req.body);
  if (existingUser) {
    return res.status(400).send({ message: "User already exists" });
  }

  await user.create(req.body);

  res.status(200).json({
    success: true,
    message: "User created successfully",
  });
});

// @desc   Login user
// @route  POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide an email and password" });
  }

  // Check if user exists
  const existingUser = await user.findOne({ email }).select("+password"); // Fixed variable name

  if (!existingUser || !(await existingUser.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  sendTokenResponse(existingUser, 200, res);
});


// @desc Upload Single Image
// @route POST /api/v1/auth/upload
// @access Private

exports.uploadImage = asyncHandler(async (req, res, next) => {
  // // check for the file size and send an error message
  // if (req.file.size > process.env.MAX_FILE_UPLOAD) {
  //   return res.status(400).send({
  //     message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
  //   });
  // }

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});

// Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    //Cookie will expire in 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Cookie security is false .if you want https then use this code. do not use in development time
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }
  //we have created a cookie with a token

  res
    .status(statusCode)
    .cookie("token", token, options) // key , value ,options
    .json({
      success: true,
      token,
    });
};
