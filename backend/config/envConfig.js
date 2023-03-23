require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpireMinutes: process.env.JWT_ACCESS_EXPIRE_MINUTES,
    refreshExpireDays: process.env.JWT_REFRESH_EXPIRE_DAYS,
  },
};
