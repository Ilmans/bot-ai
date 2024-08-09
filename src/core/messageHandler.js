const { checkContact, saveContact, removeContact } = require("../lib/helpers");
const ResponFormatter = require("../lib/responFormatter");
const GeminiAi = require("./geminiAi");
const OpenAiLocal = require("./openAi");
const StickerWa = require("./stickerWa");

class MessageHandler {
  async process(req, res) {
    const { message, bufferImage, from } = req.body;
    const isRegistered = await checkContact(from);

    const responFormatter = new ResponFormatter();

    if (message === "/start") {
      if (!isRegistered) await saveContact(from);
      const msg = responFormatter
        .line("Bot active, happy to use it!")
        .responAsText();
      return res.send(msg);
    }

    if (message === "/stop") {
      if (isRegistered) await removeContact(from);
      res.send(
        responFormatter.line("Bot inactive, see you later!").responAsText()
      );
    }

    if (!isRegistered) return;

    //handle sticker command
    if (message === "/sticker") {
      if (!bufferImage) {
        return res.send(
          responFormatter
            .line("Please send image if using command /sticker")
            .responAsText()
        );
      }

      return res.send(
        responFormatter.responSticker(await StickerWa.create(bufferImage))
      );
    }

    try {
      let response;
      if (process.env.BOT_ACTIVE === "openai") {
        response = await OpenAiLocal.run(from, message);
      } else if (process.env.BOT_ACTIVE === "geminiai") {
        response = await GeminiAi.run(from, message);
      } else {
        throw new Error("Invalid BOT_ACTIVE value");
      }

      return res.send(responFormatter.line(response).responAsText());
    } catch (error) {
      console.log("something went wrong in gemini ai", error);
    }
  }
}

module.exports = MessageHandler;
