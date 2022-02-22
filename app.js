const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); 
const morgan = require("morgan");
const connectDB = require("./config/db");
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')

dotenv.config({path: './config/config.env'});

const app = express();

// body-parser middleware
app.use(express.json())

// database connection
connectDB()



// middleware
app.use(express.static("public"));

// morgan middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// view engine

app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

app.use(cookieParser())



// testing
// app.get('/set-cookie', (req, res) => {
//   res.cookie('newUser', 'true')
//   res.cookie('newEmployee', 'false', {httpOnly: true, maxAge: 1000 * 60 * 60 * 24})
//   res.send('hey new cookie')
// })

// app.get('/get-cookie', (req, res) => {
//   const cookie = req.cookies
//   console.log(cookie)
//   res.send('ok')
// })


// routes
app.use('/', require('./routes/index'))
app.use("/smoothies", require('./routes/smoothies'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`server is running in ${process.env.NODE_ENV} node on ${PORT}`))
