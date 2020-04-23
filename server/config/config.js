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

if (process.env.NODE_ENV == 'dev') {
  urlDB = 'mongodb://localhost:27017/coffee';
} else {
  urlDB = 'mongodb+srv://root:evy2aFVx7ggh6Iqs@cluster0-wbjur.mongodb.net/coffee';
}

process.env.URLDB = urlDB;