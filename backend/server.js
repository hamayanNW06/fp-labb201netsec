const express = require("express");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const passport = require("passport");
const { jwtStrategy } = require("./config/jwt");
const config = require("./config/envConfig");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use("/api/filmcluster", require("./routes/filmclusterRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(config.port, () =>
  console.log(`Server started on port ${config.port}`)
);
