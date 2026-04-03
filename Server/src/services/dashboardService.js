const Record = require("../models/Record");

const getSummary = async () => {
  const result = await Record.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
        },
        totalExpenses: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const data = result[0] || { totalIncome: 0, totalExpenses: 0, count: 0 };

  return {
    totalIncome: data.totalIncome,
    totalExpenses: data.totalExpenses,
    netBalance: data.totalIncome - data.totalExpenses,
    totalRecords: data.count,
  };
};

const getCategoryBreakdown = async () => {
  return Record.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);
};

const getMonthlyTrends = async () => {
  return Record.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        type: "$_id.type",
        total: 1,
        count: 1,
      },
    },
    { $sort: { year: -1, month: -1 } },
  ]);
};

const getRecentActivity = async (limit = 10) => {
  return Record.find({ isDeleted: false })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = { getSummary, getCategoryBreakdown, getMonthlyTrends, getRecentActivity };
