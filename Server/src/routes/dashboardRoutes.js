const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.use(authenticate);
router.use(authorize("read:dashboard"));

router.get("/summary", dashboardController.getSummary);
router.get("/categories", dashboardController.getCategoryBreakdown);
router.get("/trends", dashboardController.getMonthlyTrends);
router.get("/recent", dashboardController.getRecentActivity);

module.exports = router;
