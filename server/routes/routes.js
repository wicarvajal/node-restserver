const express = require('express');
const app = express();
const UserModel = require('../models/user')
const _ = require('underscore');

const bcrypt = require('bcrypt');

app.get('/user', function (req, res) {

  let from = Number(req.query.from) || 0;
  let to = Number(req.query.to) || 0;

  UserModel.find({ state: true })
  .skip(from)
  .limit(to)
  .exec((err, userArr) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    UserModel.countDocuments({ state: true }, (err, count) => {
      res.json({
        ok: true,
        userArr,
        count
      });
    })

  })
});

app.post('/user', function (req, res) {

  let body = req.body;

  let user = new UserModel({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  })

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      user: userDB
    })
  })

});

app.put('/user/:id', function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'state']);

  UserModel.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      user: userDB
    });
  });
});

app.delete('/user/:id', function (req, res) {
  let id = req.params.id;

  UserModel.findByIdAndUpdate(id, {state: false}, {new: true}, (err, userDeleted) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!userDeleted) {
      return res.status(400).json({
        ok: false,
        err: 'No encontrado'
      });
    }

    res.json({
      ok: true,
      user: userDeleted
    })
  })
});

module.exports = app