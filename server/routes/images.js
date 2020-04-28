const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verifyToken, verifyImgToken } = require('../middlewares/auth');

app.get('/image/:type/:img', verifyImgToken, (req, res) => {
  let type = req.params.type;
  let img = req.params.img;

  let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);
  console.log(pathImg);

  if(fs.existsSync(pathImg)) {
    res.sendfile(pathImg);
  } else {
    let noImgPath = path.resolve(__dirname, '../assets/noimg.jpg');
    res.sendFile(noImgPath);
  }
})

module.exports = app;
