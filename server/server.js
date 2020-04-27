const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

require('./config/config');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// console.log(path.resolve(__dirname, '../public'));

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err, res) => {
  if (err) {
    console.log(err);
    throw err;
  }
});

app.listen(process.env.PORT, () => {
  console.log('Escuchando puerto: ', process.env.PORT);
});