const express = require('../node_modules/express');
const router = express.Router();

const auth = require('../middleware/auth');

const authCtrl = require('../controllers/auth')

router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

module.exports = router;