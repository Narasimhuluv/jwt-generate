var express = require("express");
var router = express.Router();
let User = require("../models/User");
let jwt = require("jsonwebtoken");

/* GET users listing. */
router.get("/new", (req, res) => {
 res.render("register");
});

router.post("/new", async (req, res, next) => {
 try {
  let existUser = await User.findOne({ email: req.body.email });
  if (!existUser) {
   let userCreate = await User.create(req.body);
   res.status(201).redirect("/users/login");
  } else {
   return res.status(400).json({ message: "User Already Existed" });
  }
 } catch (error) {
  return error;
 }
});

router.get("/login", (req, res) => {
 res.render("login");
});

router.post("/login", async (req, res, next) => {
 let { email, password } = req.body;
 if (!email || !password) {
  return res.status(400).json({ error: "Email and Password Requried" });
 }
 try {
  let existUser = await User.findOne({ email: email });
  if (!existUser) {
   return res.status(400).json({ error: "Email is Not Registered" });
  }

  //  verifyPassword
  let verifyUser = await existUser.verifyPassword(password);
  if (!verifyUser) {
   return res.status(400).json({ error: "Invalid Password" });
  }
  //  generate token
  let token = await existUser.signToken();
  let userJsonStructured = await existUser.userJson(token);
  res.json({ userJsonStructured });
 } catch (error) {
  next(error);
 }
});

module.exports = router;
