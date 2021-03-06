const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
  let token = req.get('Authorization');

  jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    req.user = decoded.user;
    // console.log(req.user);
    // console.log(decoded);
    // console.log(req);
    next();
  });
}

let verifyAdminRole = (req, res, next) => {
  if (req.user.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No es admin'
      }
    })
  }
}

let verifyImgToken = (req, res, next) => {
  let token = req.query.token;

  jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    req.user = decoded.user;
    next();
  });
}

module.exports = {
  verifyToken,
  verifyAdminRole,
  verifyImgToken
};