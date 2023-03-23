const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");
const passport = require("passport");

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    if (info instanceof TokenExpiredError) {
      return reject(new Error("Token expired"));
    } else if (info instanceof JsonWebTokenError) {
      return reject(new Error("Invalid token"));
    } else {
      return reject(new Error("Unauthorized"));
    }
  }
  req.user = user;

  resolve();
};

const authGuard = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = authGuard;
