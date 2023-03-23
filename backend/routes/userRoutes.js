const express = require("express");
const { getMe } = require("../controllers/userController");
const authGuard = require("../middleware/authGuardMiddleware");

const router = express.Router();

router.get("/me", authGuard, getMe);

module.exports = router;
