"use strict";

var express = require("express");

var dotenv = require("dotenv").config(); // config dot env


var hbs = require("express-handlebars");

var path = require("path");

var bodyParser = require("body-parser");

var checkInternetConnection = require("./config/CheckInternet");

var mongoose = require("mongoose");

var session = require("express-session");

var passport = require("passport");

var flash = require("connect-flash");

var toastr = require("express-toastr");

var cookieParser = require("cookie-parser");

var app = express(); // Connect to MongoDB using Mongoose

mongoose.connect(process.env.MONGOOSEDB_URL).then(function () {
  return console.log("Connected to Mongoose DB");
})["catch"](function (error) {
  return console.error("Error connecting to Mongoose DB:", error);
});
app.engine("hbs", hbs.engine({
  defaultLayout: "main",
  extname: ".hbs",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }
}));
app.set("view engine", "hbs");
app.set("views", "./views"); // Đăng ký body-parser trên app

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json()); // register file static files

app.use(express["static"](path.join(__dirname, "/public"))); //

app.use(cookieParser());
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
})); //confif flash

app.use(flash());
app.use(toastr());
app.use(function (req, res, next) {
  res.locals.toasts = req.toastr.render();
  next();
});
app.use(passport.initialize());
app.use(passport.session()); //require routers

var auth = require("./routers/User/auth");

var home = require("./routers/User/home");

var profile = require("./routers/User/profile");

var deliver = require("./routers/User/deliver");

var history = require("./routers/User/history");

var order = require("./routers/order");

var userAdmin = require("./routers/Admin/user");

var employeeAdmin = require("./routers/Admin/employee");

var orderAdmin = require("./routers/Admin/orderAdmin"); //Routers


app.use("/auth", checkInternetConnection, auth);
app.use("/express", checkInternetConnection, deliver);
app.use("/profile", checkInternetConnection, profile);
app.use("/order_history", checkInternetConnection, history);
app.use("/employee", checkInternetConnection, order);
app.use("/admin/orderAdmin", checkInternetConnection, orderAdmin);
app.use("/admin/employee", checkInternetConnection, employeeAdmin);
app.use("/admin/user", checkInternetConnection, userAdmin);
app.use("/", checkInternetConnection, home);
app.use("/home", checkInternetConnection, home);
app.use("*", function (req, res) {
  res.status(404);
});
app.listen(process.env.PORT, function () {
  console.log("Server is running on port http://localhost:" + process.env.PORT);
});