const express = require("express");
const {
  getFilm,
  postFilm,
  putFilm,
  deleteFilm,
  getFilmById,
} = require("../controllers/filmclusterController");
const authGuard = require("../middleware/authGuardMiddleware");

const router = express.Router();

router.route("/").get(authGuard, getFilm).post(authGuard, postFilm);

//ini atas sama bawah sama ya memek cuma ini multiple expresion
router.get("/:id", authGuard, getFilmById);
router.put("/:id", authGuard, putFilm);
router.delete("/:id", authGuard, deleteFilm);

module.exports = router;
