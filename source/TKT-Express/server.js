const express = require("express");
const dotenv = require("dotenv").config(); // config dot env
const hbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const checkInternetConnection = require("./config/CheckInternet");
const mongoose = require("mongoose");
const session = require("express-session");

const passport = require("passport");
const flash = require("connect-flash");
const toastr = require("express-toastr");
const cookieParser = require("cookie-parser");
const app = express();

// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.MONGOOSEDB_URL)
  .then(() => console.log("Connected to Mongoose DB"))
  .catch((error) => console.error("Error connecting to Mongoose DB:", error));

app.engine(
  "hbs",
  hbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

// Đăng ký body-parser trên app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// register file static files
app.use(express.static(path.join(__dirname, "/public")));

//
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

//confif flash
app.use(flash());
app.use(toastr());
app.use(function (req, res, next) {
  res.locals.toasts = req.toastr.render();
  next();
});

app.use(passport.initialize());
app.use(passport.session());

//require routers
const auth = require("./routers/User/auth");
const home = require("./routers/User/home");
const profile = require("./routers/User/profile");
const deliver = require("./routers/User/deliver");
const history = require("./routers/User/history");
const order = require("./routers/order");

const userAdmin = require("./routers/Admin/user");
const employeeAdmin = require("./routers/Admin/employee");
const orderAdmin = require("./routers/Admin/orderAdmin");
//Routers
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

app.use("*", (req, res) => {
  res.status(404);
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port http://localhost:" + process.env.PORT);
});
