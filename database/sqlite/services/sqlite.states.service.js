const sequelize = require("../sqlite.database");
const State = require("../models/state.model");

async function createNewState(discordId, state) {
  const newState = await State.create({
    discordId,
    fighting: state,
  });

  console.log("new state of", discordId);

  return newState.toJSON();
}
async function hasData(discordId) {
  return State.count({ where: { discordId: discordId } }).then((count) => {
    if (count != 0) {
      return false;
    }
    return true;
  });
}

async function updateState(discordId, fighting) {
  const found = await State.findOne({ where: { discordId: discordId } });
  if (!found) {
    console.log("create new state");
    await createNewState(discordId);
  }
  await State.update(
    { fighting },
    {
      where: {
        discordId: discordId,
      },
    }
  );

  const updated = await State.findAll({
    where: {
      discordId,
    },
  });

  //   console.log("updated: ", updated[0]);
  return updated[0];
}

async function getAllStates() {
  const states = await State.findAll();
  return states;
}

async function resetFightingState() {
  const result = await State.update(
    {
      fighting: false,
    },
    {
      where: {
        fighting: true,
      },
    }
  );
}

async function canPlay(discordId) {
  const fighting = await State.findOne({ where: { discordId: discordId } });
  if (fighting == null) {
    await createNewState(discordId, true);
    return true;
  } else {
    const { dataValues } = fighting;
    if (dataValues.fighting) {
      return false;
    } else if (!dataValues.fighting) {
      return true;
    }
  }
}

module.exports = {
  createNewState,
  getAllStates,
  updateState,
  canPlay,
};
