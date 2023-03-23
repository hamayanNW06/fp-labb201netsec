const mongoose = require("mongoose");

//si Schema ppk ini di isi sesuai parameter apa aja yang ada di JSON
const tokenSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    expiredAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("refreshToken", tokenSchema);
