const mongoose = require("mongoose");
const envConfig = require("./envConfig");
require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envConfig.mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.green.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
