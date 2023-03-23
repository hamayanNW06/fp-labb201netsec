const { request } = require("express");
const asyncHandler = require("express-async-handler");

const Movie = require("../model/movieModel");

//Iki bagian get

const getFilm = asyncHandler(async (req, res) => {
  const movies = await Movie.find();

  res.status(200).json(movies);
});

const getFilmById = asyncHandler(async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404).json({ message: "Movie not found" }); //gak nemu
    } else {
      res.status(200).json(movie);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal error" });
  }
});

//{"_id":{"$oid":"6417244d24b0cad420538cc8"},"genres":"[{'id': 16, 'name': 'Animation'}, {'id': 35, 'name': 'Comedy'}, {'id': 10751, 'name': 'Family'}]","original_language":"en","original_title":"Toy Story","overview":"Led by Woody, Andy's toys live happily in his room until Andy's birthday brings Buzz Lightyear onto the scene. Afraid of losing his place in Andy's heart, Woody plots against Buzz. But when circumstances separate Buzz and Woody from their owner, the duo eventually learns to put aside their differences.","popularity":"21.946943","production_companies":"[{'name': 'Pixar Animation Studios', 'id': 3}]","release_date":"1995-10-30","runtime":"81.0","title":"Toy Story"}
//iki bagian post
//SET
const postFilm = asyncHandler(async (req, res) => {
  if (
    !req.body.genres ||
    !req.body.original_language ||
    !req.body.original_title ||
    !req.body.overview ||
    !req.body.popularity ||
    !req.body.production_companies ||
    !req.body.release_date ||
    !req.body.runtime ||
    !req.body.title
  ) {
    res.status(400).json({ message: "All attribute required" }); //semua mesti diisi
  } else {
    try {
      const movie = await Movie.create({
        genres: req.body.genres,
        original_language: req.body.original_language,
        original_title: req.body.original_title,
        overview: req.body.overview,
        popularity: req.body.popularity,
        production_companies: req.body.production_companies,
        release_date: req.body.release_date,
        runtime: req.body.runtime,
        title: req.body.title,
      });

      res.status(201).json({ message: "Movie created", movie }); //buat baru
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    }
  }
});

//iki bagian put
//iki update su
const putFilm = asyncHandler(async (req, res) => {
  const moviePUT = await Movie.findById(req.params.id);

  if (!moviePUT) {
    res.status(404).json({ message: "Movie not found" });
  } else {
    try {
      const putedfilm = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      res
        .status(204)
        .json({ message: `Updated movie ${req.params.id}`, movie: putedfilm }); //sukses update data
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    }
  }
});

//iki bagian delete
const deleteFilm = asyncHandler(async (req, res) => {
  const movieDELETE = await Movie.findById(req.params.id);

  if (!movieDELETE) {
    res.status(404).json({ message: "Film tidak ditemukan" });
  } else {
    try {
      await Movie.findByIdAndDelete(req.params.id);

      res.status(204).json({ message: `Deleted movie ${req.params.id}` }); //sukses nge delete data
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    }
  }
});

module.exports = {
  getFilm,
  postFilm,
  putFilm,
  deleteFilm,
  getFilmById,
};
