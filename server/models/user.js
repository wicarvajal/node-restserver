const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol valido'
}

let userSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Nombre obligatorio']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Mail obligatorio']
  },
  password: {
    type: String,
    required: [true, 'Pass obligatorio']
  },
  img: {
    type: String
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: validRoles
  },
  state: {
    type: Boolean,
    default: true
  },
  gmail: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.toJSON = function () {
  let user = this;
  let userObj = user.toObject();
  delete userObj.password;
  return userObj;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('User', userSchema);
