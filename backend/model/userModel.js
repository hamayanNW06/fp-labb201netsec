const mongoose = require("mongoose");
const argon2 = require("argon2");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({
    email,
    _id: mongoose.trusted({ $ne: excludeUserId }),
  });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await argon2.verify(user.password, password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await argon2.hash(user.password);
  }
  next();
});

module.exports = mongoose.model("user", userSchema);
