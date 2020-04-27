const express = require('express');
const app = express();

app.use(require('./user-routes'));
app.use(require('./login'));
app.use(require('./category-routes'));





module.exports = app;
