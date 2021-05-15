const mongoose = require('../node_modules/mongoose');
const uniqueValidator = require('../node_modules/mongoose-unique-validator');

///creation du modèle pour la création d'utilisateurs
const userShema = mongoose.Schema({
  email: { type: String, require : true, unique : true},
  password : { type: String, require : true}
});

userShema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userShema);