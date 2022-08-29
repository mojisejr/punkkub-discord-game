const admin = require("firebase-admin");
const basePath = process.cwd();
require("dotenv").config({
  path: `${basePath}/config.env`,
});

// const credentials = require("../punkkub.json");

//production
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key.replace(/\\n/g, "\n"),
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
  }),
});

// Dev mode
// admin.initializeApp({
//   credential: admin.credential.cert(credentials),
// });

//using firestore
const db = admin.firestore();

//firestore collection reference
const Collection = {
  Holder: db.collection("holder"),
  Profile: db.collection("profile"),
  Inventory: db.collection("inventory"),
  FightingLog: db.collection("fightinglogs"),
  Quests: db.collection("quests"),
  Community: db.collection("community"),
  Guests: db.collection("guests"),
};

const SubCollection = {
  Profile: {
    ActiveQuests: "ActiveQuests",
    CompletedQuests: "CompletedQuests",
  },
  Community: {
    Profile: "profile",
  },
};

module.exports = {
  Collection,
  SubCollection,
  db,
};
