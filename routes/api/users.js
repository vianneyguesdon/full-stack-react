const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load User model
const User = require("../../models/User");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route         GET api/users/all
// @descrip       Display all users
// @access        Restricted
router.get("/all", (req, res) => res.json({ msg: "Users works!" }));

// @route         POST api/users/register
// @descrip       Registration of a new user
// @access        Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Input
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      User.countDocuments((err, count) => {
        console.log(`There are already ${count} users in the database`);
        const newUser = new User({
          userNumber: count + 1,
          firstName: req.body.firstName,
          surname: req.body.surname,
          address: req.body.address,
          email: req.body.email,
          password: req.body.password,
          phoneNumber: req.body.phoneNumber,
          sector: req.body.sector,
          availabiity: req.body.date,
          status: req.body.status
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      });
    }
  });
});

// @route         GET api/users/login
// @descrip       Login User / Returning JWT Token
// @access        Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Input
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check User
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // Create JWT Payload
        const payload = {
          id: user.id,
          firstName: user.firstName,
          surname: user.surname
        };
        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 60 * 60 }, // 1h session
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(404).json(errors);
      }
    });
  });
});

// @route         GET api/users/current
// @descrip       Return the current user
// @access        Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      surname: req.user.surname,
      email: req.user.email
    });
  }
);

module.exports = router;
