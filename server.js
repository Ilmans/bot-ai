const express = require("express");
const bodyParser = require("body-parser");
const MessageHandler = require("./src/core/messageHandler");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const handlerMessage = new MessageHandler();

//create src/data/contacts.json if not exist
const fs = require("fs");
const pathcontact = `${__dirname}/src/data/contacts.json`;
if (!fs.existsSync(pathcontact)) {
  fs.writeFileSync(pathcontact, "[]");
}

app.use(bodyParser.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("This is webhook url , integrated with BOT AI - m pedia");
});
app.post("/bot", handlerMessage.process);

//url static
app.use(express.static("public"));
app.use("/images", express.static("images"));

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
