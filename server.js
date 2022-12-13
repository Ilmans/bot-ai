const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3400;
const model = require('./model')

app.use(bodyParser.urlencoded({limit : '50mb'}))
app.use(bodyParser.json({limit : '50mb'}))

app.get('/', (req, res) => {
    res.send('This is webhook url , integrated with BOT AI - m pedia')
})
app.post('/bot', model.botAi)


app.use(express.static('public'));
app.use('/images', express.static('images'));

app.listen(port,()=> {
    console.log(`app running on port ${port}`);
})