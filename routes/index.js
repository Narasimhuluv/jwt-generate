var express = require("express");
const auth = require("../middlewares/auth");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
 res.render("index", { title: "Express" });
});

router.get("/protected", auth.verifyToken, (req, res) => {
 res.json({ access: "Protected Resource and verified Token" });
});

module.exports = router;
