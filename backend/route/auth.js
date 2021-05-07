const express = require('../node_modules/express');
const router = express.Router();

const auth = require('../middleware/auth');

//connexion des routes au controllers
const authCtrl = require('../controllers/auth')

//création des differente route possible avec leur connexion au controllers
router.post('/signup', auth, authCtrl.signup);
router.post('/login', auth, authCtrl.login);

module.exports = router;