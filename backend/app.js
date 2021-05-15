//importation des bibliotheque nécessaire
const express = require('../backend/node_modules/express');
const bodyParser = require('body-parser');
const mongoose = require('../backend/node_modules/mongoose');
const path = require('path');
const helmet = require("../backend/node_modules/helmet");
const  mongoSanitize  =  require ( '../backend/node_modules/express-mongo-sanitize' ) ;
const rateLimit = require("../backend/node_modules/express-rate-limit");

const dotenv  = require('../backend/node_modules/dotenv');
dotenv.config();


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});


//importation des routes
const sauceRoutes = require('./route/sauce');
const authRoutes = require('./route/auth');

const app = express();

//connexion à la mongoose
mongoose.connect(process.env.DB,
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
app.use(helmet());
app.use(mongoSanitize({
  replaceWith: '_'
}));
app.use(limiter);


//connexion aux routes
app.use('/images', express.static(path.join(__dirname, 'image')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;