const express = require("express");
const mongoose = require("mongoose");
const expressSession = require("express-session");
var MongoStore = require("connect-mongo")(expressSession);
const passport = require("passport");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");

// Instantiation
const port = process.env.PORT || 3000;
const app = express();

// Middleware de bodyParser pour recupérer le contenu des champs en react
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config et Connexion à la base de données
const db = require("./config/keys").localDb;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Succesfully connected to Mongo DB"))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Passport Config

// Routes
app.get("/", (req, res) => {
  res.send("home page");
});

// Use
app.use("/api/users", users);

// Listen Server
app.listen(port, () => {
  console.log(`Server starter on port : ${port}`);
});
