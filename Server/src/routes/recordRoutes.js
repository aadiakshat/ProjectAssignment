const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const { recordRules, updateRecordRules } = require("../validators");

router.use(authenticate);

router.get("/", authorize("read:records"), recordController.getAll);
router.get("/:id", authorize("read:records"), recordController.getOne);

router.post(
  "/",
  authorize("write:records"),
  validate(recordRules),
  recordController.create
);

router.patch(
  "/:id",
  authorize("write:records"),
  validate(updateRecordRules),
  recordController.update
);

router.delete(
  "/:id",
  authorize("delete:records"),
  recordController.remove
);

module.exports = router;
