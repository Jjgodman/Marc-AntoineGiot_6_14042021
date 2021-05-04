const express = require('../node_modules/express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//connexion des routes au controllers
const sauceCtrl = require('../controllers/sauce')

//création des differente route possible avec leur connexion au controllers
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth,  sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.usersLikes);

module.exports = router;