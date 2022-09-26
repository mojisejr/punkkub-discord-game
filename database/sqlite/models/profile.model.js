const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sqlite.database");

class Profile extends Model {}

Profile.init(
  {
    discordId: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    dailyPveCount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    dailyPvpCount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    exp: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    fightCount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    lastfightTime: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    win: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    lost: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    pvpLost: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    pvpWin: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "profile",
  }
);

module.exports = Profile;
