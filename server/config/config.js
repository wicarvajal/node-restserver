// ============================
//  Port
// ============================
process.env.PORT = process.env.PORT || 3000;
// ============================
//  Environment
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ============================
//  DB
// ============================
let urlDB;

// ============================
//  token
// ============================
process.env.TOKEN_EXP = 1000 * 60 * 60 * 24 * 30;
process.env.TOKEN_SEED = 'secret';

process.env.CLIENT_ID = process.env.CLIENT_ID || '305003947445-1no8iqlggfhpcgc9sleh7320ghccqgii.apps.googleusercontent.com';





if (process.env.NODE_ENV == 'dev') {
  urlDB = 'mongodb://localhost:27017/coffee';
} else {
  urlDB = 'mongodb+srv://root:evy2aFVx7ggh6Iqs@cluster0-wbjur.mongodb.net/coffee';
}

process.env.URLDB = urlDB;