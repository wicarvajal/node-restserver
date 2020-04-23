const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
  let body = req.body;

  UserModel.findOne({email: body.email}, (err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if (!userDB) {
      return res.status(400).json({
        ok: false,
        message: 'Usuario o contraseña incorrectos'
      })
    }

    if(! bcrypt.compareSync(body.password, userDB.password)) {
      return res.status(400).json({
        ok: false,
        message: 'Contraseña incorrecta'
      })
    }

    let token = jwt.sign({
      user: userDB
    }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXP });

    res.json({
      ok: true,
      token,
      user: userDB
    })
  });
})


module.exports = app;