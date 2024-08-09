const fs = require("fs");
const Caching = require("node-cache");
const cache = new Caching();
const pathcontact = `${__dirname}/../data/contacts.json`;

const loadContact = async () => {
  const fileBuffer = fs.readFileSync(pathcontact, "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

const saveContact = async (from) => {
  const contact = { from };
  const contacts = await loadContact();
  contacts.push(contact);
  fs.writeFileSync(pathcontact, JSON.stringify(contacts));
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
  fs.writeFileSync(pathcontact, JSON.stringify(contactsNew));
};

const manageMessagesCache = (number, role, content, isGemini = true) => {
  const newContent = isGemini
    ? { parts: [{ text: content }] }
    : { content: content };

  let msgs = cache.get("messages" + number) ?? [];

  const messages = [
    ...msgs,
    {
      role,
      ...newContent,
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
