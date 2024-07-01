const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://harishjadhav675:DXDCYru7ci63enfW@cluster0.srzf13p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const db = mongoose.connection;

db.on("error", function (err) {
  console.log(err.message);
});

db.once("open", function () {
  console.log("Successfully connected to the database");
});

module.exports = db;