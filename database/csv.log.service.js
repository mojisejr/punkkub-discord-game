const createWriter = require("csv-writer").createObjectCsvWriter;
const writer = createWriter({
  path: "./logs.csv",
  header: [
    { id: "timestamp", title: "timestamp" },
    { id: "message", title: "message" },
    { id: "type", title: "type" },
    { id: "from", title: "from" },
  ],
  append: true,
});

async function log(message, type, from = "N/A", save = true) {
  const timestamp = new Date();
  console.log(`log(${timestamp})[${type}]: ${message}  - from ${from}`);
  const msg = [{ timestamp: timestamp.getTime(), message, type, from }];
  if (save) {
    writer.writeRecords(msg).then(() => "done writing logs");
  }
}

module.exports = {
  log,
};
