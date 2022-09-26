const {
  getAllStates,
} = require("../database/sqlite/services/sqlite.states.service");
const {
  getAllProfile,
} = require("../database/sqlite/services/sqlite.profile.service");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3001;

app.get("/playstate/all", async (req, res) => {
  const states = await getAllStates();
  res.status(200).json({
    data: states,
  });
});

app.get("/profile/all", async (req, res) => {
  const profiles = await getAllProfile();
  res.status(200).json({
    data: profiles,
  });
});

// app.get("/inventory/all", async (req, res) => {
// });

app.listen(PORT, () => {
  console.log("apis server is ready");
});
