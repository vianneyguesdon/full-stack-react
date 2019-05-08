const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//  Création du Schéma
var UserSchema = new Schema({
  userNumber: { type: Number },
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  address: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  sector: { type: String },
  availabiity: { type: Date, default: Date.now },
  status: { type: String }
});

module.exports = User = mongoose.model("users", UserSchema);
