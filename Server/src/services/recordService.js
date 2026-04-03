const Record = require("../models/Record");

const createRecord = async (data, userId) => {
  return Record.create({ ...data, createdBy: userId });
};

const getRecords = async (filters = {}, pagination = {}) => {
  const query = { isDeleted: false };

  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = { $regex: filters.category, $options: "i" };

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  if (filters.minAmount || filters.maxAmount) {
    query.amount = {};
    if (filters.minAmount) query.amount.$gte = Number(filters.minAmount);
    if (filters.maxAmount) query.amount.$lte = Number(filters.maxAmount);
  }

  const page = parseInt(pagination.page) || 1;
  const limit = parseInt(pagination.limit) || 20;
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Record.find(query)
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Record.countDocuments(query),
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getRecordById = async (id) => {
  const record = await Record.findOne({ _id: id, isDeleted: false }).populate(
    "createdBy",
    "name email"
  );

  if (!record) {
    const err = new Error("Record not found");
    err.statusCode = 404;
    throw err;
  }

  return record;
};

const updateRecord = async (id, updates) => {
  const allowed = ["amount", "type", "category", "date", "description"];
  const filtered = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }

  const record = await Record.findOneAndUpdate(
    { _id: id, isDeleted: false },
    filtered,
    { new: true, runValidators: true }
  );

  if (!record) {
    const err = new Error("Record not found");
    err.statusCode = 404;
    throw err;
  }

  return record;
};

const deleteRecord = async (id) => {
  const record = await Record.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!record) {
    const err = new Error("Record not found");
    err.statusCode = 404;
    throw err;
  }

  return record;
};

module.exports = { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };
