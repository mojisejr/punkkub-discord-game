const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sqlite.database");

class Inventory extends Model {}

Inventory.init(
  {
    discordId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amounts: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "inventory",
  }
);

module.exports = Inventory;
