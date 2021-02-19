const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");

router.post("/login", userController.loginUser);
router.post("/pass", userController.loginUserPassport);
router.post("/create", userController.createUser);
router.get("/all", userController.getUsers);
router.get(
  "/:id?",
  passport.authenticate("jwt", { session: false }),
  userController.getUser
);

module.exports = router;
