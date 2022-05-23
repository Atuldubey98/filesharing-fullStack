const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const register = async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const newUser = new User({
      password: await bcryptjs.hash(password, 12),
      ...data,
    });
    await newUser.save();
    return res.status(201).json({ status: true, message: "User created" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ status: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const extUser = await User.findOne({ email });
    if (!extUser) {
      return res.status(400).json({ status: false });
    }
    if (!(await bcryptjs.compare(password, extUser.password))) {
      return res.status(400).json({ status: false });
    }
    const filter = { email };
    const update = { isLoggedIn: true };
    await User.findOneAndUpdate(filter, update);
    return res
      .status(200)
      .json({ status: true, message: "User Authenticated" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ status: false });
  }
};
const logout = async (req, res) => {
  try {
    const filter = { email };
    const update = { isLoggedIn: false, socketId: "" };
    await User.findOneAndUpdate(filter, update);
  } catch (e) {
    return res.status(400).json({ status: false });
  }
};
module.exports = {
  register,
  login,
  logout,
};
