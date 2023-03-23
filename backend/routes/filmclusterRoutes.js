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

router.route("/").get(getFilm).post(authGuard, postFilm);

//ini atas sama bawah sama ya memek cuma ini multiple expresion
router.get("/:id", getFilmById);
router.put("/:id", authGuard, putFilm);
router.delete("/:id", authGuard, deleteFilm);

module.exports = router;
