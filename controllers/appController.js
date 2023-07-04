const { render } = require('ejs');
const model = require('../models/mobile');
const watchList = require('../models/watchList');
const tradeData = require('../models/tradeData');



//GET to get all the trades
exports.getAll = (req,res,next) => {
    // res.send('getting all the trade items');
    let headerValue = 'PRODUCTS';
    model.find()
    .then(data => {
        const groupBy = key => array =>
            array.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
            }, {});

            const groupByCategory = groupBy('item_category');
            const temp = JSON.stringify({
                itemsByCategory: groupByCategory(data),
            }, null, 2);
            
        res.render('./mobile/trades',{temp,headerValue})
    })
    .catch(err=>next(err));
};

//GET trade item details using id
exports.openDetails = (req,res, next) => {
    let id = req.params.id;
    let headerValue = 'PRODUCT DETAIL';
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid product id');
        err.status = 400;
        return next(err);
    }else{
        model.findById(id)
        .then(data => {
            
            if(data){
                watchList.findOne({trade_item_id : id, user_id: req.session.user})
                .then((watchListData => {
                    res.render('./mobile/trade_detail',{data,headerValue,watchListData});
                }))
                .catch(err => next(err));
            }else{
                let err = new Error('Cannot find trade data with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
    }
};

//GET add new item page
exports.addNewItem = (req,res) => {
    let headerValue = 'ADD NEW PRODUCT';
    res.render('./mobile/add_new_trade',{headerValue});
};

//creating a new mobile document
exports.addNewTradeToDatabase = (req,res,next) => {
    let body = new model(req.body);
    body.image = 'default_image.png';
    body.created_by = req.session.user;
    body.status = 1;

    body.save()
    .then((mobile) => {
        res.redirect('/trades');
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });

};

//GET trade item details using id
exports.edit = (req,res,next) => {
    let id  = req.params.id;
    let headerValue = 'EDIT PRODUCT';

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid product id');
        err.status = 400;
        return next(err);
    }else{
        model.findById(id)
        .then(data => {
            if(data){
                res.render('./mobile/edit_product',{data,headerValue});
            }else{
                let err = new Error('Cannot find product with id to edit' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
    }
};

//PUT updating the new details of the trade using id
exports.update = (req,res, next) => {
    let body = req.body;
    let id = req.params.id;
    
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid Product Id');
        err.status = 400;
        return next(err);
    }else{

        model.findByIdAndUpdate(id,body, {useFindAndModify : false, runValidators : true})
        .then(data => {
            if(data){
                res.redirect('/trades/' + id) ;
            }else{
                let err = new Error('Cannot update the product with id '+id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if(err.name === 'ValidationError'){
                err.status = 400;
            }
            next(err)
        });
    }
    
};

//DELETE delete trade using id
exports.delete = (req,res,next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid product id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndDelete(id,{useFindAndModify : false})
    .then(data => {
        if(data){
            watchList.deleteMany({trade_item_id : id})
            .then((data1) => {

                tradeData.find({
                    "$or": [{
                     "trade_with" :  id 
                  },{ "trade_item" :  id
                    }]
                 })
                 .then(val => {
                    console.log(val[0]);
                    var updateId;
                    if(val[0].trade_with == id){
                        updateId = val[0].trade_item;
                    }else if(val[0].trade_item == id){
                        updateId = val[0].trade_with;
                    }
                    console.log("THE ID TO BE UPDATED AS 1" + updateId);

                    tradeData.findByIdAndDelete(val[0]._id)
                    .then(() => {
                        model.updateOne({_id : updateId},{$set: {"status" : 1}})
                        .then(() => res.redirect('/trades'))
                        .catch(err=>next(err));
                    })
                    .catch(err => next(err));
  

                 })
                 .catch(err => next(err));

            })
            .catch(err => next(err));
            
        }else{
            let err = new Error('Cannot delete the product with id '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));

};

//add the trade item to the watch list of the current user
exports.addToWatchList = (req,res,next) => {
    let id = req.params.id;
    let body = new watchList();
    body.user_id = req.session.user;
    body.trade_item_id = id;
    
    body.save()
    .then((data) => {
        req.flash('success','Trade Item Added To Watch List');
        res.redirect('/users/profile');
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};

//remove from the watch list of database
exports.removeFromWatchList = (req,res,next) => {
    let id = req.params.id;
    watchList.deleteOne({ _id : id})
    .then(() => {
        req.flash('error','Trade Item Removed From Watch List');
        res.redirect('/users/profile');
    })
    .catch(err => next(err));
}

