const express = require('express');
const controller = require('../controllers/appController');
const {isGuest} = require('../middlewares/auth');
const {isLoggedIn, isCreatedBy} = require('../middlewares/auth');

const router = express.Router();

//DELETE delete trade using id
router.delete('/:id', isLoggedIn, isCreatedBy, controller.delete);

//GET to get all the trades
router.get('/', controller.getAll);

//GET add new trade item
router.get('/new', isLoggedIn, controller.addNewItem);

//GET trade item details using id
router.get('/:id', controller.openDetails);
router.post('/:id', controller.openDetails);


//GET trade item details using id
router.get('/:id/edit', isLoggedIn, isCreatedBy, controller.edit);

//POST add new trades item
router.post('/', isLoggedIn, controller.addNewTradeToDatabase);

//PUT updating the new details of the trade using id
router.put('/:id', isLoggedIn, isCreatedBy, controller.update);

//POST to add the trade item to the watch list of the current user
router.post('/:id/watch',isLoggedIn, controller.addToWatchList);

//POST to remove from the trades watch list of the current user 
router.post('/:id/unwatch',isLoggedIn, controller.removeFromWatchList);


module.exports = router;