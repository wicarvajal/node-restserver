const express = require('express');
const app = express();

app.use(require('./user-routes'));
app.use(require('./login'));
app.use(require('./category-routes'));
app.use(require('./product-routes'));





module.exports = app;
