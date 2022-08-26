const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sqlite.database");

class GameState extends Model {}

GameState.init(
  {
    discordId: {
      type: DataTypes.STRING,
    },
    fighting: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: "state",
  }
);

module.exports = GameState;
