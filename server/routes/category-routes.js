const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const app = express();
let CategorySchema = require('../models/category-model')
const _ = require('underscore');

app.get('/categorias', verifyToken, (req, res) => {
  CategorySchema.find()
  .populate('user', 'nombre email')
  .exec((err, arrCategory) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      arrCategory
    });
  })
});

app.get('/categoria/:id', verifyToken, (req, res) => {
  id = req.params.id;

  CategorySchema.findById(id)
  .populate('user', 'nombre email')
  .exec((err, category) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      category
    });
  })
});

app.post('/categoria', verifyToken, (req, res) => {
  let body = req.body;

  let category = new CategorySchema({
    description: body.description,
    user: req.user._id
  });

  category.save((err, categoryDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      categoryDB
    });
  })
});

app.put('/categoria/:id', verifyToken, (req, res) => {
  id = req.params.id;
  let category = _.pick(req.body, 'description');

  CategorySchema.findByIdAndUpdate(id, category, { new: true, runValidators: true }, (err, categoryDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if (!categoryDB) {
      return res.status(400).json({
        ok: false,
        err: 'No existe id'
      })
    }

    res.json({
      ok: true,
      category
    });
  })
});

app.delete('/categoria/:id', verifyToken, (req, res) => {
  id = req.params.id;

  CategorySchema.findByIdAndRemove(id, { new: true }, (err, category) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      category
    });
  })
});

module.exports = app;
