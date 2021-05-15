const bcrypt = require('../node_modules/bcrypt');
const jwt = require('../node_modules/jsonwebtoken');
const dotenv  = require('../../backend/node_modules/dotenv');
dotenv.config();

const User = require('../models/User');


//route pour la création de compte
exports.signup = (req, res, next) => {
 
  //sécurisation du mdp
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/.test(req.body.password)) {   
    return res.status(401).json({ error: 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre (8 caractères min)' });
  }
  else {   
    //utilisation de bcrypt pour scripter le mdp
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const user = new User({
            email : req.body.email,
            password : hash
          });
          //sauvegarde de l'utilisateur dans la base de données
          user.save()
            .then(() =>res.status(201).json({message: 'Utilisateur crée !'}))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }
};

//route pour la connexion
exports.login = (req, res, next) => {
  //on chercher l'utilisateur dans la base de données via sont email
    User.findOne({ email: req.body.email })
      .then(user => {
        //s'il n'est pas trouvé alors error 401
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        //s'il est trouvé alors on compare sont mdp avec le hash de bcrypt
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            //si le mdp n'est pas correcte alors error 401
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            //si le mdp est bon alors on créer un token de connexion
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.TOKEN,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };