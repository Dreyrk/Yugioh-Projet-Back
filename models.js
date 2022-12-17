import { DataTypes } from "sequelize";
import db from "./database.js";

const CardModel = db.define(
  "Cards",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
    },
    Rarity: {
      type: DataTypes.STRING,
    },
    Description: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "yugioh_table",
    timestamps: false,
  }
);

export default CardModel;

//
