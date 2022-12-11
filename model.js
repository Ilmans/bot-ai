const {Sticker,createSticker,StickerTypes} = require('wa-sticker-formatter');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: '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',
});

const openai = new OpenAIApi(configuration);

const fs = require('fs');
const botAi = async (req,res) => {
    const {message,bufferImage,from} = req.body;

    let sip = false;
    if (message == '/start'){
          const lk = await checkContact(from);
          if(lk == false) {
              saveContact(from)
        } 
        sip = { text: 'Bot telah aktif ,silahkan dimanfaatkan :)' }
    } else if (message == '/stop' ) {
        const lk = await checkContact(from);
        if (lk == true) {
            removeContact(from)
        }
        sip = { text: 'Bot telah dihentikan,,terimakasih :)' }
    } else {

        const check = await checkContact(from);
        if(check){

            if (bufferImage) {
                if (message == '/stiker') {
                    const buffer = Buffer.from(bufferImage,'base64');
                    fs.writeFileSync('./public/images/testing.png',buffer)
                    if(fs.existsSync('./public/images/testing.webp')){
                       fs.unlinkSync('./public/images/testing.webp')
                    }
                    const sticker = new Sticker('http://localhost:3400/images/testing.png', {
                        pack: 'MPedia Pack', // The pack name
                        author: 'M Pedia', // The author name
                        type: StickerTypes.CROPPED,
                        categories: ['🤩', '🎉'], // The sticker category
                        id: '12345', // The sticker id
                        quality: 50, // The quality of the output file
                        background: '#000000' // The sticker background color (only for full stickers)
                    })
                    const k = await sticker.toFile('./public/images/testing.webp');
            
                   sip = {sticker : {url : 'http://localhost:3400/images/testing.webp'}}
                }
                
            } else {
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: "Q : ".message,
                    temperature: 0, 
                    max_tokens: 300,
                    top_p: 1,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.0,
                    stop: ["\n"],
                  
                });
        
               const res = response.data.choices[0].text;
              
               sip = {text : res}
        
        
            }
        }
    }



   res.json(sip)
}



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
   
    const contacts =  await loadContact();
    const contact =  contacts.find(
        (contact) => contact.from === from
    )

   if(!contact) {
    return false;
   }
   return true;

}

const removeContact = async (from)   => {
   
    const contacts = await loadContact();
   
    const contactsNew = contacts.filter(
        (contact) => contact.from != from
    )
    console.log(contactsNew);
 
   

    fs.writeFileSync('datakontak.json',JSON.stringify(contactsNew));
   
}
module.exports = {
    botAi
}