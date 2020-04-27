const express = require('express');
const app = express();
const UserModel = require('../models/user')
const _ = require('underscore');
const {verifyToken, verifyAdminRole} = require('../middlewares/auth');

module.exports = app;