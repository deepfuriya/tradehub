const { render } = require('ejs');
const model = require("../models/user");
const mobile = require('../models/mobile');
const watchList = require('../models/watchList');
const tradeData = require('../models/tradeData');


exports.loginPage = (req,res) => {
    let headerValue = 'LOGIN IN';
    res.render('users/login',{headerValue});
};

// authentication login data
exports.checkLogin = (req, res, next) => {
    //authentic user`s login request
    let email = req.body.email;
    if(email){
      email = email.toLowerCase();
    }
    let password = req.body.password;
  
    //get the user that matches the email
    model
      .findOne({ email: email })
      .then((user) => {
        if (user) {
          //user found in the database
          user.comparePassword(password).then((result) => {
            if (result) {
              req.session.user = user._id;
              req.session.userName = user.firstName + " " + user.lastName;
              req.flash("success", "You have successfully logged in");
              res.redirect("/users/profile");
            } else {
              req.flash("error", "Wrong Password!");
              res.redirect("/users/login");
            }
          });
        } else {
          req.flash("error", "Wrong email address!");
          res.redirect("/users/login");
        }
      })
      .catch((err) => next(err));
  };

exports.signUpPage = (req,res) => {
    let headerValue = 'SIGN UP';
    res.render('users/signup',{headerValue});
};


// new user creation
exports.createNewUser = (req, res, next) => {
    let user = new model(req.body);
    if(user.email){
      user.email = user.email.toLowerCase();
    }
    user.save()
      .then(() => {
        req.flash("error", "New user created successfully");
        res.redirect("/users/login")
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          req.flash("error", err.message);
          return res.redirect("/users/signup");
        }
        if (err.code === 11000) {
          req.flash("error", "Email address has already been used");
          return res.redirect("/users/signup");
        }
        next(err);
      });
};

exports.profilePage = (req,res,next) => {
  let headerValue = 'PROFILE';
  let id = req.session.user;
  let name = req.session.userName;

  mobile.find({created_by: id})
  .then(tradeItems => {
    watchList.find({user_id : id}).populate('trade_item_id','item_category item_name status')
    .then(watchListData => {
      console.log(watchListData);
      tradeData.find({
        "$or": [{
         "accepter_user_id" :  id 
      },{ "creater_user_id" :  id
        }]
     })
      .populate('trade_with','item_category item_name created_by')
      .populate('trade_item','item_category item_name created_by')
      .then(currentTradingData => {
        res.render("./users/profile", { id,name,headerValue,tradeItems,watchListData,currentTradingData });
      })
      .catch(err => next(err));

    })
    .catch(err => next(err));

  })
  .catch(err => next(err));
};


exports.logout = (req, res, next)=>{
  req.session.destroy(err=>{
      if(err) 
         return next(err);
     else
          res.redirect('/');  
  });
 
};

exports.fetchAllAvailableTradeProducts = (req,res,next) => {
    let headerValue = 'TRADE PRODUCTS';
    let id = req.session.user;
    let tradeId = req.params.id;
    let body = req.body;
    let accepter_user_id = body.accepter_user_id;
    
    mobile.find({created_by: id,status: "1"})
    .then(productsData => {
      res.render('users/selectTrade',{accepter_user_id,tradeId,headerValue,productsData});
    })
    .catch(err => next(err));
    
}

exports.saveUserTradeTransaction = (req,res,next) => {
  
  let body = new tradeData(req.body);
  body.creater_user_id = req.session.user;
  body.status = 1;

  body.save()
  .then(() => {
    mobile.updateMany(
      {
        _id: {
          $in: [body.trade_item, body.trade_with]
        }
      },
      {
        $set: {
          status: "2"
        }
      }
    )
    .then(() => {
      req.flash('success','Trade Request Sent Successfully');
    })
    .catch(err => next(err));
    res.redirect('/users/profile');
  })
  .catch(err => next(err));
}


exports.deleteTradeOffer = (req,res,next) => {
  let id = req.params.id;
  tradeData.findByIdAndDelete(id,{useFindAndModify : false})
  .then(data => {
    if(data){
      mobile.updateMany(
        {
          _id: {
            $in: [data.trade_item, data.trade_with]
          }
        },
        {
          $set: {
            status: "1"
          }
        }
      )
      .then(() => {
        req.flash('success','Trade Offer Deleted Successfully');
        res.redirect('/users/profile');
      })
      .catch(err => next(err));
    }else{
      let err = new Error("Cannot cancel the offer");
      err.status = 404;
      next(err);
    }
  })
  .catch(err => next(err));
};

exports.findOfferDetailsById = (req,res,next) => {
  let id = req.params.id;
  let currentUser = req.session.user;
  tradeData.findById(id)
  .populate('trade_with','item_category item_name image')
  .populate('trade_item','item_category item_name image')
  .then(data => {
    let headerValue = 'MANAGE OFFER';
    res.render('users/offer',{data,headerValue,currentUser});
  })
  .catch(err => next(err));
};

exports.acceptOffer = (req,res,next) => {
  let offerId = req.body.offer_id;
  tradeData.findByIdAndUpdate(offerId,{"status":2},{new: true})
  .then(data => {
    console.log(data);
    mobile.updateMany(
      {
        _id: {
          $in: [data.trade_item, data.trade_with]
        }
      },
      {
        $set: {
          status: "3"
        }
      }
    )
    .then(e => {
      console.log(e);
      res.redirect('/users/profile');
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
};