const dashboardService = require("../services/dashboardService");

const getSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary();
    res.json({ summary });
  } catch (err) {
    next(err);
  }
};

const getCategoryBreakdown = async (req, res, next) => {
  try {
    const breakdown = await dashboardService.getCategoryBreakdown();
    res.json({ breakdown });
  } catch (err) {
    next(err);
  }
};

const getMonthlyTrends = async (req, res, next) => {
  try {
    const trends = await dashboardService.getMonthlyTrends();
    res.json({ trends });
  } catch (err) {
    next(err);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activity = await dashboardService.getRecentActivity(limit);
    res.json({ activity });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getCategoryBreakdown, getMonthlyTrends, getRecentActivity };
