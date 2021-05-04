//importation des bibliotheque nécessaire
const express = require('../backend/node_modules/express');
const bodyParser = require('body-parser');
const mongoose = require('../backend/node_modules/mongoose');
const path = require('path');

//importation des routes
const sauceRoutes = require('./route/sauce');
const authRoutes = require('./route/auth');

const app = express();

//connexion à la mongoose
mongoose.connect('mongodb+srv://panda:admin@cluster0.xhxx5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//autorisation de connexion pour tout le monde
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

//connexion aux routes
app.use('/images', express.static(path.join(__dirname, 'image')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;