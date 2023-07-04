const express = require('express');
const siteController = require('../controllers/siteController');

const router = express.Router();

router.get('/',siteController.mainPage);

router.get('/about',siteController.aboutPage);

router.get('/contact',siteController.contactPage);


module.exports = router;
