const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sqlite.database");

class Quest extends Model {}

Quest.init(
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
    },
    collection: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    globalReward: {
      type: DataTypes.NUMBER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rewardUnit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rewards: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    target: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    timeout: {
      type: DataTypes.NUMBER,
    },
    type: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "quest",
  }
);

module.exports = Quest;
