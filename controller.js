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
    const id = req.params.id;

    db.query("SELECT * FROM yugioh_table WHERE ID = ?", [id])
      .then(([results]) => {
        if (results[0] != null) {
          if (results[0].id === id) {
            res.status(200).send(results[0]);
          } else {
            res.status(404).send(error.notFound);
          }
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
      "INSERT INTO yugioh_table(name, rarity, description) VALUES (?, ?, ?)",
      [name, rarity, description]
    )
      .then(([results]) => {
        res.status(201).location(`/api/cards/${results.insertId}`);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(error.dbPostError);
      });
  },
};

export default controller;
