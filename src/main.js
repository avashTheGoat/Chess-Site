require('dotenv').config()
const express = require('express');
const app = express();
const router = express.Router();

const serverless = require('serverless-http');

const PORT = process.env.PORT || 3000;

app.use('/', express.static(process.cwd() + '/public'));

app.get('/engine_url.txt', (req, res) => {
    res.sendFile(process.cwd() + '/engine_url.txt');
});

app.get('/img/chesspieces/:piece', (req, res) => {
    res.sendFile(process.cwd() + `/img/chesspieces/${req.params.piece}`);
});

app.get('/fonts/Roboto-Regular.ttf', (req, res) => {
    res.sendFile(process.cwd() + '/fonts/Roboto-Regular.ttf');
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

app.use('/.netlify/functions/main', router);
module.exports.handler = serverless(app);