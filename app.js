var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require('cors')
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
require("./config/passport");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var taskRouter = require('./routes/taskRoutes')
const { profile } = require("console");

var app = express();
main().catch((err) => console.log(err));
async function main() {
  const url =
    "mongodb+srv://naveen:Venkat.3697@cluster0.fqntuci.mongodb.net/taskapplication?retryWrites=true&w=majority";
  await mongoose.connect(url);
  console.log("Mongodb connected");
}
app.use(passport.initialize());
app.use(cors())
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Route for handle logins and signup
app.use("/auth", authRouter);
app.use('/task',taskRouter);

app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route to handle the callback from Google
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Generate JWT token after Google login
    const token = jwt.sign(
      { id: req.user.id, username: req.user.displayName },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // Redirect user with token in URL query (or set it in cookies/local storage on client)
    res.redirect(
      `http://localhost:3000/dashboard?token=${token}&username=${req.user.displayName}`
    );
  }
);
app.get("/api/auth/logout", (req, res) => {
  // Clear session
  req.logout(); // Log out from Passport session
  req.session = null; // Clear cookie session

  res.json({ message: "Logged out successfully" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
