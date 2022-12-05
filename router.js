import express from "express";
import controller from "./controller.js";

const router = express.Router();

//Routes GET

router.get("/", (req, res, next) => {
  res.status(200).send("Welcome !");
});

router.get("/api/cards", controller.getCards);
router.get("/api/all", controller.getAllCards);
router.get("/api/cards/:id", controller.getCardById);

//Routes POST

router.post("/api/cards", controller.postCard);

export default router;
