const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const _ = require('underscore');
app.use(fileUpload({ useTempFiles: true }));

const fs = require('fs');
const path = require('path');

const UserSchema = require('../models/user');
const ProductSchema = require('../models/product-model');

app.put('/upload/:type/:id', function (req, res) {

  let type = req.params.type;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: 'No selecciono archivo'
    })
  }

  // validar tipo
  let validTypes = ['products', 'users'];

  if (validTypes.indexOf(type) < 0) {
    return res.status(500).json({
      ok: false,
      err: `tipos validos: ${validTypes.join(', ')}`,
    });
  }

  let validExtensions = ['jpg', 'png', 'gif', 'jpeg'];
  let file = req.files.fileToUpload;
  let fileNameArray = file.name.split('.');
  let extension = _.last(fileNameArray);

  let newFileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

  if (_.find(validExtensions, (validExt) => { return validExt === extension })) {
    file.mv(`uploads/${type}/${newFileName}`, (err) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (type == 'users') {
        setUserImage(id, res, newFileName);
      } else {
        setProductImage(id, res, newFileName);
      }
    })
  } else {
    return res.status(400).json({
      ok: false,
      err: `extensiones validas: ${validExtensions.join(', ')}`,
      currExtension: extension
    });
  }
});

function setUserImage(id, res, filename) {
  UserSchema.findById(id, (err, userDB) => {
    if (err) {
      // si no encuentra el id usuario, borra la imagen subida
      deleteFile(filename, 'users');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    deleteFile(userDB.img, 'users');

    userDB.img = filename;
    userDB.save((err, userSaved) => {
      res.json({
        ok: true,
        user: userSaved,
        img: filename
      })
    })
  })
}

function setProductImage(id, res, filename) {
  ProductSchema.findById(id, (err, productDB) => {
    if (err) {
      // si no encuentra el id usuario, borra la imagen subida
      deleteFile(filename, 'products');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    deleteFile(productDB.img, 'products');

    productDB.img = filename;
    productDB.save((err, productSaved) => {
      res.json({
        ok: true,
        user: productSaved,
        img: filename
      })
    })
  })
}

function deleteFile(filename, type) {
  let pathImg = path.resolve(__dirname, `../../uploads/${type}/${filename}`);

  if (fs.existsSync(pathImg)) {
    fs.unlinkSync(pathImg);
  }
}

module.exports = app;