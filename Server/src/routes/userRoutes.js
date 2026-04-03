const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const { registerRules, loginRules, updateUserRules } = require("../validators");

router.post("/register", validate(registerRules), userController.register);
router.post("/login", validate(loginRules), userController.login);

router.get("/me", authenticate, userController.getProfile);

router.get(
  "/",
  authenticate,
  authorize("manage:users"),
  userController.getAllUsers
);

router.get(
  "/:id",
  authenticate,
  authorize("manage:users"),
  userController.getUserById
);

router.patch(
  "/:id",
  authenticate,
  authorize("manage:users"),
  validate(updateUserRules),
  userController.updateUser
);

module.exports = router;
