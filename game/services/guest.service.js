const { Collection } = require("../../database/firestore");

async function getGuestPVEPoint(discordId) {
  const snapshot = await Collection.Guests.doc(discordId).get();
  if (snapshot !== undefined) {
    const guest = snapshot.data();
    return (point = snapshot.data() === undefined ? 0 : guest.gPveCount);
  }
}

async function addGuestPVEPoint(discordId) {
  const currentPoint = await getGuestPVEPoint(discordId);
  await Collection.Guests.doc(discordId).set({
    gPveCount: currentPoint + 1,
  });
}

module.exports = { addGuestPVEPoint };
