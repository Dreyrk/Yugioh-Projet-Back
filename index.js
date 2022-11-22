import express from "express";
import controller from "./controller.js";
import db from "./database.js";
import cors from "cors";

const port = process.env.PORT ?? 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});

//connect db
db.getConnection()
  .then()
  .catch((err) => {
    console.error(err);
  });

app.get("/", (req, res, next) => {
  res.status(200).send("Welcome !");
});

//Routes GET

app.get("/api/cards", controller.getCards);
app.get("/api/cards/:id", controller.getCardById);

//Routes POST

app.post("/api/cards", controller.postCard);
