
const fs = require('fs')
const loadContact = async () => {
    const fileBuffer = fs.readFileSync('datakontak.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer);
    return contacts;
}

const saveContact = async (from) => {
    const contact = { from };
    const contacts = await loadContact();
    contacts.push(contact);
    fs.writeFileSync('datakontak.json', JSON.stringify(contacts));
}

const checkContact = async (from) => {
    const contacts = await loadContact();
    const contact = contacts.find(
        (contact) => contact.from === from
    )
    if (!contact) {
        return false;
    }
    return true;

}

const removeContact = async (from) => {
    const contacts = await loadContact();
    const contactsNew = contacts.filter(
        (contact) => contact.from != from
    )
    console.log(contactsNew);
    fs.writeFileSync('datakontak.json', JSON.stringify(contactsNew));

}

module.exports = {
    loadContact,
    saveContact,
    checkContact,
    removeContact
}