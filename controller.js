import db from "./database.js";
import CardsModel from "./models.js";

const error = {
  notFound: { err: "Card not found" },
  dbGetError: { err: "Error retrieving data from database" },
  dbPostError: { err: "Error saving cards" },
};

const controller = {
  getCards: async (req, res) => {
    const { page, limit } = req.query;

    const pageNumber = Number.parseInt(page);
    const limitNumber = Number.parseInt(limit);

    let pages = 0;

    if (pageNumber > 0 && !Number.isNaN(pageNumber)) {
      pages = pageNumber;
    }

    let size = 12;

    if (limitNumber > 0 && !Number.isNaN(limitNumber)) {
      size = limitNumber;
    }

    const cards = await CardsModel.findAndCountAll({
      limit: size,
      offset: pages * size,
      attributes: ["Name", "Rarity", "Description"],
    });

    res.status(200).send({
      results: cards.rows,
      totalPages: Math.ceil(cards.count / size),
    });
  },
  getAllCards: (req, res) => {
    db.query("SELECT * FROM yugioh_table")
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
