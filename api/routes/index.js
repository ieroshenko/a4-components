const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Run = require("../models/Run");

// @desc login/landing page
// @route GET /
router.get("/", ensureGuest, (req, res) => {
  res.send("Hello World!")
  // res.render("login", { layout: "login" });
});

// @desc main application with CRUD for current user
// @route GET /home
router.get("/home", ensureAuth, async (req, res) =>
  {
  try {
    res.send("Home")
    // let runs = await Run.find( {user: req.user.id}).lean();
    // runs = runs.reverse();
    // res.render('home', {
    //   name: req.user.username,
    //   runs,
    // });
  } catch (e) {
    console.log(e);
  }
}
);

module.exports = router;
