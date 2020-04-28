const express = require('express');
const app = express();
const ProductSchema = require('../models/product-model')
const _ = require('underscore');
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');

app.get('/product', verifyToken, (req, res) => {

  let from = Number(req.query.from) || 0;
  let to = Number(req.query.to) || 0;

  ProductSchema.find({})
    .populate('usuario', 'nombre email')
    .populate('categoria', 'description')
    .skip(from)
    .limit(to)
    .exec((err, productArr) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        productArr
      });

    })
});

app.get('/product/buscar/:termino', verifyToken, (req, res) => {

  let search = req.params.termino;
  let regex = new RegExp(search, 'i')

  ProductSchema.find({ nombre: regex })
    .populate('usuario', 'nombre email')
    .populate('categoria', 'description')
    .exec((err, productArr) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        productArr
      });

    })
});

app.get('/product:id', verifyToken, (req, res) => {

  let id = req.params.id;

  ProductSchema.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'description')
    .exec((err, productArr) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        productArr
      });

    })
});

app.post('/product', [verifyToken, verifyAdminRole], function (req, res) {

  let body = req.body;

  let product = new ProductSchema({
    nombre: body.nombre,
    precioUni: body.price,
    descripcion: body.description,
    disponible: body.available,
    categoria: body.category,
    usuario: req.user._id
  })

  product.save((err, productDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.status(201).json({
      ok: true,
      productDB
    })
  })

});

app.put('/product/:id', verifyToken, function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'price', 'description', 'available', 'category']);

  ProductSchema.findById(id, (err, productDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if (!productDB) {
      return res.status(400).json({
        ok: false,
        err: 'Id no existe'
      })
    }

    productDB.nombre = body.nombre;
    productDB.precioUni = body.price;
    productDB.descripcion = body.description;
    productDB.disponible = body.available
    productDB.categoria = body.category
    productDB.usuario = req.user._id

    productDB.save((err, productDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        product: productDB
      });
    })

  });
});

app.delete('/product/:id', verifyToken, function (req, res) {
  let id = req.params.id;

  ProductSchema.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productDeleted) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!productDeleted) {
      return res.status(400).json({
        ok: false,
        err: 'No encontrado'
      });
    }

    res.json({
      ok: true,
      product: productDeleted
    })
  })
});

module.exports = app