const express = require('express');
const itemsController = require('../controllers/items');
const router = express.Router();

router.get('/', itemsController.getMainPage);
router.get('/secrets', itemsController.getSecrets);
router.get('/register', itemsController.getRegister);
router.post('/register', itemsController.postRegister);
router.get('/submit', itemsController.getSubmit);
router.post('/submit', itemsController.postSubmit);
router.get('/login', itemsController.getLogin);
router.post('/login', itemsController.postLogin);
router.get('/logout', itemsController.getLogout);

module.exports = router;