const express = require("express");
const router = express.Router();
const { ensureAuth, checkCurrentUser } = require('../middleware/auth')
const {
  getDashboard,
  getSignup,
  getLogin,
  signupPost,
  loginPost,
  getLogout
} = require("../controllers/indexControllers");

// get dashboard
router.get("/", ensureAuth, checkCurrentUser, getDashboard);

// signup page
router.get("/signup", getSignup);

// login page
router.get("/login", getLogin);

// process signup
router.post("/signup", signupPost);

// authenticate
router.post("/login", loginPost);


// logout
router.get('/logout', getLogout)

module.exports = router;
