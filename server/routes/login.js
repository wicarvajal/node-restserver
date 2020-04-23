const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req, res) => {
  let body = req.body;

  UserModel.findOne({ email: body.email }, (err, userDB) => {
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

    if (!bcrypt.compareSync(body.password, userDB.password)) {
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

// Google config
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID
  });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

app.post('/google', async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token)
    .catch(e => {
      return res.status(403).json({
        ok: false,
        err: e
      });
    });

  UserModel.findOne({ email: googleUser.email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (userDB) {
      if (userDB.google === false) {
        return res.status(500).json({
          ok: false,
          err: 'Debe usar auth normal'
        })
      } else {
        let token = jwt.sign({
          user: userDB
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXP });

        return res.json({
          ok: true,
          user: userDB,
          token
        })
      }
    } else {
      let user = new UserModel();

      user.nombre = googleUser.nombre,
      user.email = googleUser.email,
      user.img = googleUser.img,
      user.gmail = true,
      user.password = 'asd',

      user.save((err, userDB) =>{
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }
    
        let token = jwt.sign({
          user: userDB
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXP });

        return res.json({
          ok: true,
          user: userDB,
          token
        })
      })
    }
  });
})



module.exports = app;