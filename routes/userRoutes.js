const express = require('express');
const userController = require('../controllers/userController');

const {isGuest} = require('../middlewares/auth');
const {isLoggedIn} = require('../middlewares/auth');
const {checkIfProductExisits} = require('../middlewares/auth');
const {validateSignUp, validateLogin, validateResult} = require('../middlewares/validator');
const {logInLimiter} = require('../middlewares/rateLimiter');

const router = express.Router();

router.get('/login',isGuest, userController.loginPage);
router.post('/login',logInLimiter, isGuest, validateLogin, validateResult,userController.checkLogin);

router.get('/signup', isGuest, userController.signUpPage);
router.post('/signup',isGuest, validateSignUp, validateResult, userController.createNewUser);


router.get('/profile',isLoggedIn, userController.profilePage);

router.get('/logout', userController.logout);

router.post('/trade/:id',isLoggedIn, checkIfProductExisits, userController.fetchAllAvailableTradeProducts);

router.post('/trade/',isLoggedIn, userController.saveUserTradeTransaction);

router.delete('/offer/:id',isLoggedIn, userController.deleteTradeOffer);

router.get('/offer/:id',isLoggedIn, userController.findOfferDetailsById);

router.post('/offer/',isLoggedIn, userController.acceptOffer);


module.exports = router;
