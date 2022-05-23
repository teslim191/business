const User = require("../models/User")
const Contact = require("../models/Contact")
const Subscribe = require("../models/Subscribe")
// require the jsonwebtoken
const jwt = require("jsonwebtoken");

// handling errors
const handleError = (err) => {
  console.log(err.message, err.code);

  let errors = { email: "", password: "" };

  // duplicate email
  if (err.code === 11000) {
    errors.email = "email already exists";
    // return errors;
  }
  // incorrect email at login
  if (err.message == "incorrect email") {
    errors.email = "email is incorrect";
  }

  // incorrect password at login
  if (err.message == "password incorrect") {
    errors.password = "password is incorrect";
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// create token

// token to last 3 days
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN, {
    expiresIn: maxAge,
  });
};

module.exports = {
  getDashboard: (req, res) => {
    res.render("index");
  },
  getSignup: (req, res) => {
    res.render("signup", { layout: "auth" });
  },
  getLogin: (req, res) => {
    res.render("login", { layout: "auth" });
  },
  signupPost: async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.create({ email, password });
      // call the token after creating the user
      const token = createToken(user._id);
      // place the token inside a cookie and send it as part of the response
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

      res.status(200).json(user._id);
    } catch (err) {
      const errors = handleError(err);
      res.status(400).json({ errors });
      // console.log(err)
    }
  },
  loginPost: async (req, res) => {
    const { email, password } = req.body;
    try {
      // login the user using the static login
      const user = await User.login(email, password);
      // create the token
      const token = createToken(user._id);
      // create the cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      // if successful, it will return a user
      res.status(200).json({ user: user._id });
    } catch (err) {
      const errors = handleError(err);
      res.status(400).json({ errors });
    }
  },

  getLogout: (req, res) => {
    // set the jwt to an empty string and give it a maxage of 1 milisecond
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/login");
  },
  contact: async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    try {
      let contact = await Contact.create({
        name,
        email,
        phone,
        subject,
        message,
      });
       req.flash("success_msg", "message sent successfully");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  },
  subscribe: async (req, res) => {
    const {email} = req.body
    try {
      let subscribe = await Subscribe.findOne({email})
      if (subscribe) {
        req.flash('error', 'subscribed already')
        res.redirect('/')                                 
      }
      else{
        await Subscribe.create({email})
        req.flash('success', 'You have subscribed to our mailing list')
        res.redirect('/')
      }   
    } catch (error) {
      console.log(error)
      
    }
  }
};
