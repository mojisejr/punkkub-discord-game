const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sqlite.database");

class Community extends Model {}

Community.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    exp: {
      type: DataTypes.NUMBER,
    },
    level: {
      type: DataTypes.NUMBER,
    },
  },
  { sequelize, modelName: "community" }
);

module.exports = Community;
