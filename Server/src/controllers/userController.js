const userService = require("../services/userService");

const register = async (req, res, next) => {
  try {
    const { user, token } = await userService.register(req.body);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await userService.login(req.body);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, getAllUsers, getUserById, updateUser };
