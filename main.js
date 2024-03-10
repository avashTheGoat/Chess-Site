require('dotenv').config()
const express = require('express');
const app = express();

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