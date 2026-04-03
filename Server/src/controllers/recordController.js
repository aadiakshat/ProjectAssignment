const recordService = require("../services/recordService");

const create = async (req, res, next) => {
  try {
    const record = await recordService.createRecord(req.body, req.user._id);
    res.status(201).json({ record });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, minAmount, maxAmount } = req.query;
    const { page, limit } = req.query;

    const result = await recordService.getRecords(
      { type, category, startDate, endDate, minAmount, maxAmount },
      { page, limit }
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    res.json({ record });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    res.json({ record });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await recordService.deleteRecord(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getOne, update, remove };
