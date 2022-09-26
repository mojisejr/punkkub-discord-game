const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sqlite.database");

class Holder extends Model {}

Holder.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    discordId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discordName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastbalance: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "holder",
  }
);

module.exports = Holder;
