const express = require('express');
const bodyParser = require('body-parser');
const process = require('process');

const app = express();
const port = process.env.PORT || 5001;
const GameEngine = require('../gameEngine');

const engine = new GameEngine();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(engine.getState());
});

app.post('/', (req, res) => {
    console.log(new Date(), req.body);
    engine.handle(req.body.message);
    res.send(engine.getState());
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Engine listening on port ${port}!`));
}

module.exports = app;
