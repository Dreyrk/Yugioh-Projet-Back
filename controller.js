import CardsModel from "./models.js";
import { Op } from "sequelize";

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
  getAllCards: async (req, res) => {
    const AllCards = await CardsModel.findAndCountAll({
      attributes: ["Name", "Rarity", "Description"],
    });
    res
      .status(200)
      .send({
        results: AllCards.rows,
        totalCards: AllCards.count,
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(error.dbGetError);
      });
  },
  searchCards: async (req, res) => {
    const { name = "", rarity = "" } = req.query;

    const Cards = await CardsModel.findAndCountAll({
      attributes: ["Name", "Rarity", "Description"],
      where: {
        Name: {
          [Op.like]: `${name}%`,
        },
        Rarity: {
          [Op.like]: `%${rarity}%`,
        },
      },
      order: [["Name", "ASC"]],
    });
    res
      .status(200)
      .send({
        results: Cards.rows,
        totalCards: Cards.count,
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(error.dbGetError);
      });
  },
  getCardById: async (req, res) => {
    const id = parseInt(req.params.id);
    const OneCards = await CardsModel.findOne({
      attributes: ["Name", "Rarity", "Description"],
      where: {
        ID: id,
      },
    });
    res
      .status(200)
      .send({
        results: OneCards,
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(error.dbGetError);
      });
  },
  postCard: async (req, res) => {
    console.log(req.body);
    const { name = "DefaultName", rarity = "", description = "" } = req.body;
    const newCard = await CardsModel.create(
      {
        Name: name,
        Rarity: rarity,
        Description: description,
      },
      {
        isNewRecord: true,
      }
    ).catch((err) => {
      console.error(err);
      res.status(500).send(error.dbPostError);
    });
    res.status(201).send({ data: newCard });
  },
};

export default controller;
