const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sqlite.database");

class ActiveQuest extends Model {}

ActiveQuest.init(
  {
    discordId: {
      type: DataTypes.STRING,
    },
    questId: {
      type: DataTypes.BOOLEAN,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
    finished: {
      type: DataTypes.BOOLEAN,
    },
    target: {
      type: DataTypes.NUMBER,
    },
    current: {
      type: DataTypes.NUMBER,
    },
    onlyOnce: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: "activequest",
  }
);

module.exports = ActiveQuest;
