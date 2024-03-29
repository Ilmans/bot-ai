const fs = require("fs");
const Caching = require("node-cache");
const cache = new Caching();
const loadContact = async () => {
  const fileBuffer = fs.readFileSync("datakontak.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

const saveContact = async (from) => {
  const contact = { from };
  const contacts = await loadContact();
  contacts.push(contact);
  fs.writeFileSync("datakontak.json", JSON.stringify(contacts));
};

const checkContact = async (from) => {
  const contacts = await loadContact();
  const contact = contacts.find((contact) => contact.from === from);
  if (!contact) {
    return false;
  }
  return true;
};

const removeContact = async (from) => {
  const contacts = await loadContact();
  const contactsNew = contacts.filter((contact) => contact.from != from);
  console.log(contactsNew);
  fs.writeFileSync("datakontak.json", JSON.stringify(contactsNew));
};

const manageMessagesCache = (number, role, content) => {
  let msgs = cache.get("messages" + number) ?? [];

  const messages = [
    ...msgs,
    {
      role,
      content,
    },
  ];

  cache.set("messages" + number, messages, 1800);

  return messages;
};

module.exports = {
  loadContact,
  saveContact,
  checkContact,
  removeContact,
  manageMessagesCache,
};
