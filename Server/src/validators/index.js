const { body } = require("express-validator");
const { ROLES } = require("../config/roles");

const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage("Invalid role"),
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateUserRules = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("role")
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage("Invalid role"),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
];

const recordRules = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date").optional().isISO8601().withMessage("Date must be a valid ISO date"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

const updateRecordRules = [
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  body("date").optional().isISO8601().withMessage("Date must be a valid ISO date"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

module.exports = { registerRules, loginRules, updateUserRules, recordRules, updateRecordRules };
