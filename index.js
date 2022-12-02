import express from "express";
import router from "./router.js";
import db from "./database.js";
import cors from "cors";

const port = process.env.PORT ?? 5000;

const app = express();

//Middlewares

app.use(express.json());
app.use(cors());

app.use(router);

//connect db
db.getConnection()
  .then()
  .catch((err) => {
    console.error(err);
  });

//Start server

app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});
