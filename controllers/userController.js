const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { constants } = require("../constants");

const User = require("../models/userSchema");

//@desc Register user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All fields are mandatory");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("User already registered");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(constants.CREATED).send({ id: user.id, email: user.email });
  } else {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("User data is invalid");
  }

  res.json({ message: "Register user" });
});

//@desc Login user
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All fields are mandatory");
  }

  const user = await User.findOne({ email });
  if (email && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          email: user.email,
          username: user.username,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "10m" }
    );
    res.status(constants.OK).json(accessToken);
  } else {
    res.status(constants.UNAUTHORIZED);
    throw new Error("Email or Password is not valid");
  }
});

//@desc current user info
//@route POST /api/users/current
//@access private

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
