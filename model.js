const fs = require("fs");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { Configuration, OpenAIApi } = require("openai");
const { removeContact, checkContact, saveContact } = require("./helpers");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const botAi = async (req, res) => {
  const { message, bufferImage, from } = req.body;

  let response = false;
  const isContactExist = await checkContact(from);
  if (message == "/start") {
    if (isContactExist == false) {
      saveContact(from);
    }
    response = { text: "Bot telah aktif ,silahkan dimanfaatkan :)" };
  } else if (message == "/stop") {
    if (isContactExist == true) {
      removeContact(from);
    }
    response = { text: "Bot telah dihentikan,,terimakasih :)" };
  } else {
    if (!isContactExist) return;
    if (message == "/stiker") {
      if (!bufferImage) return;
      const buffer = Buffer.from(bufferImage, "base64");
      fs.writeFileSync("./public/images/testing.png", buffer);
      if (fs.existsSync("./public/images/testing.webp")) {
        fs.unlinkSync("./public/images/testing.webp");
      }
      const sticker = new Sticker(
        `${process.env.BASE_URL}/images/testing.png`,
        {
          pack: "MPedia Pack", // The pack name
          author: "M Pedia", // The author name
          type: StickerTypes.CROPPED,
          categories: ["🤩", "🎉"], // The sticker category
          id: "12345", // The sticker id
          quality: 50, // The quality of the output file
          background: "#000000", // The sticker background color (only for full stickers)
        }
      );
      const k = await sticker.toFile("./public/images/testing.webp");

      response = {
        sticker: { url: `${process.env.BASE_URL}/images/testing.webp` },
      };
    } else {
      if (bufferImage) {
        response = {
          text: "ngapain kirim gambar? mau bikin stiker? pakai /stiker dong!!",
        };
      } else {
        try {
          const getResponse = await openai.createCompletion({
            model: "gpt-3.5-turbo-instruct",
            prompt: message,
            max_tokens: 300,
            temperature: 0,
          });
          console.log(getResponse.data.choices);
          response = { text: getResponse.data.choices[0].text };
        } catch (error) {
          console.log(error.response?.data?.error?.message);
        }
      }
    }
  }
  res.json(response);
};

module.exports = {
  botAi,
};
