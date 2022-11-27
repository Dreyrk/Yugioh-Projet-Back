import db from "./database.js";

const error = {
  notFound: { err: "Card not found" },
  dbGetError: { err: "Error retrieving data from database" },
  dbPostError: { err: "Error saving cards" },
};

const controller = {
  getCards: (req, res, next) => {
    db.query("SELECT * FROM yugioh_table").then(([results]) => {
      if (results != null) {
        res.status(200).send(results);
      } else {
        res.status(404).send(error.notFound);
      }
    });
  },
  getCardById: (req, res) => {
    const id = parseInt(req.params.id);

    db.query("SELECT * FROM yugioh_table WHERE id = ?", [id])
      .then(([results]) => {
        if (results[0] != null) {
          res.status(200).send(results);
        } else {
          res.status(404).send(error.notFound);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(error.dbGetError);
      });
  },
  postCard: (req, res) => {
    const { name, rarity, description } = req.body;
    db.query(
      "INSERT INTO yugioh_table(Name, Rarity, Description) VALUES (?, ?, ?)",
      [name, rarity, description]
    )
      .then(([results]) => {
        res.location(`/api/cards/${results.insertId}`).sendStatus(201);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(error.dbPostError);
      });
  },
};

export default controller;
