const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoySchema = new Schema({
  description: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
    // referencia al nombre del esquema en el module.exports
  }
})

module.exports = mongoose.model('Category', categoySchema);