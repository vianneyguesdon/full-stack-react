const isEmpty = require("./is-empty");
const Validator = require("validator");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.surname = !isEmpty(data.surname) ? data.surname : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Firstname empty and errors
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "Firstname field is required";
  }
  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName = "Firstname must be between 2 and 30 characters";
  }

  // Surname empty and errors
  if (Validator.isEmpty(data.surname)) {
    errors.surname = "Surname field is required";
  }
  if (!Validator.isLength(data.surname, { min: 2, max: 30 })) {
    errors.surname = "Surname must be between 2 and 30 characters";
  }

  // Email empty and errors
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password empty and errors
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters";
  }

  // Password2 (confirm) empty and errors
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Password confirmation is required";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords don't match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
