const { request } = require("express");
const asyncHandler = require("express-async-handler");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");

const envConfig = require("../config/envConfig");
const User = require("../model/userModel");
const RefreshToken = require("../model/refreshTokenModel");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All attribute required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  if (await User.isEmailTaken(email)) {
    return res.status(400).json({ message: "Email already taken" });
  }

  try {
    const user = await User.create({
      email,
      password,
    });

    // generate access token
    const accessTokenExpire = dayjs().add(
      envConfig.jwt.accessExpireMinutes,
      "minute"
    );

    const accessToken = jwt.sign(
      {
        sub: user._id,
        iat: dayjs().unix(),
        exp: accessTokenExpire.unix(),
      },
      envConfig.jwt.secret
    );

    // generate refresh token
    const refreshTokenExpire = dayjs().add(
      envConfig.jwt.refreshExpireDays,
      "day"
    );

    const refreshTokenEnt = await RefreshToken.create({
      user: user._id,
      expiredAt: refreshTokenExpire,
    });

    const refreshToken = jwt.sign(
      {
        sub: user._id,
        iat: dayjs().unix(),
        exp: refreshTokenExpire.unix(),
        jti: refreshTokenEnt._id,
      },
      envConfig.jwt.secret
    );

    //remove password from response
    user.password = undefined;

    return res.status(201).json({
      user,
      token: {
        refresh: {
          token: refreshToken,
          expiredAt: refreshTokenExpire,
        },
        access: {
          token: accessToken,
          expiredAt: accessTokenExpire,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All attribute required" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await user.isPasswordMatch(password))) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // generate access token
    const accessTokenExpire = dayjs().add(
      envConfig.jwt.accessExpireMinutes,
      "minute"
    );

    const accessToken = jwt.sign(
      {
        sub: user._id,
        iat: dayjs().unix(),
        exp: accessTokenExpire.unix(),
      },
      envConfig.jwt.secret
    );

    // generate refresh token
    const refreshTokenExpire = dayjs().add(
      envConfig.jwt.refreshExpireDays,
      "day"
    );

    const refreshTokenEnt = await RefreshToken.create({
      user: user._id,
      expiredAt: refreshTokenExpire,
    });

    const refreshToken = jwt.sign(
      {
        sub: user._id,
        iat: dayjs().unix(),
        exp: refreshTokenExpire.unix(),
        jti: refreshTokenEnt._id,
      },
      envConfig.jwt.secret
    );

    //remove password from response
    user.password = undefined;

    return res.status(200).json({
      user,
      token: {
        refresh: {
          token: refreshToken,
          expiredAt: refreshTokenExpire,
        },
        access: {
          token: accessToken,
          expiredAt: accessTokenExpire,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "All attribute required" });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, envConfig.jwt.secret);
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  try {
    const refreshTokenEnt = await RefreshToken.findById(decoded.jti);

    if (!refreshTokenEnt) {
      return res.status(404).json({ message: "Refresh token not found" });
    }

    if (refreshTokenEnt.expiredAt < dayjs()) {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    if (refreshTokenEnt.user.toString() !== decoded.sub) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (refreshTokenEnt.revoked) {
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    // generate access token
    const accessTokenExpire = dayjs().add(
      envConfig.jwt.accessExpireMinutes,
      "minute"
    );

    const accessToken = jwt.sign(
      {
        sub: decoded.sub,
        iat: dayjs().unix(),
        exp: accessTokenExpire.unix(),
      },
      envConfig.jwt.secret
    );

    return res.status(200).json({
      token: {
        access: {
          token: accessToken,
          expiredAt: accessTokenExpire,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
});

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
};
