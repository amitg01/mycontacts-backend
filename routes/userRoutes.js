const express = require("express");

const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", (req, res) => {
  res.json({ message: "current user" });
});

module.exports = router;
