let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

let userSchema = new Schema(
 {
  name: { type: String, required: true },
  email: { type: String, required: true, Math: /@/ },
  password: { type: String, minlength: 4, required: true },
 },
 { timestamps: true }
);

// userSchema.pre("save", function (next) {
//  if ((this.password, this.isModified("password"))) {
//   bcrypt
//    .hash(this.password, 10)
//    .then((hashed) => {
//     this.password = hashed;
//     return next();
//    })
//    .catch((err) => {
//     console.log(err);
//    });
//  } else {
//   next();
//  }
// });

userSchema.pre("save", async function (next) {
 if (this.password && this.isModified("password")) {
  this.password = await bcrypt.hash(this.password, 10);
 }
 next();
});

// userSchema.methods.verifyPassword = function (password, cb) {
//  bcrypt.compare(password, this.password, (err, result) => {
//   return cb(err, result);
//  });
// };

userSchema.methods.verifyPassword = async function (password) {
 try {
  let results = await bcrypt.compare(password, this.password);
  return results;
 } catch (error) {
  return error;
 }
 bcrypt.compare();
};

userSchema.methods.signToken = async function () {
 let payload = { userId: this.id, email: this.email };

 try {
  let token = await jwt.sign(payload, "thisisasecret");
  return token;
 } catch (error) {
  return error;
 }
};

userSchema.methods.userJson = async function (token) {
 return {
  name: this.name,
  email: this.email,
  token: token,
 };
};

let User = mongoose.model("User", userSchema);
module.exports = User;
