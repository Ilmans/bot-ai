const { checkContact, saveContact, removeContact } = require("../lib/helpers");
const ResponFormatter = require("../lib/responFormatter");
const StickerWa = require("../lib/stickerWa");

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
  }
}

module.exports = MessageHandler;
