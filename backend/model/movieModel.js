const mongoose = require("mongoose");

//si Schema ppk ini di isi sesuai parameter apa aja yang ada di JSON
const movieSchema = mongoose.Schema(
  {
    genres: {
      type: String,
      required: true,
    },
    original_language: {
      type: String,
      required: true,
    },
    original_title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    popularity: {
      type: String,
      required: true,
    },
    production_companies: {
      type: String,
      required: true,
    },
    release_date: {
      type: String,
      required: true,
    },
    runtime: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("movie", movieSchema);
