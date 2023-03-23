const asyncHandler = require("express-async-handler");

const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = {
  getMe,
};
