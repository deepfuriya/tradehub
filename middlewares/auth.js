const mobile = require('../models/mobile');


exports.isGuest = (req,res, next) => {
    if(!req.session.user){
        return next();
    }else{
        req.flash('error','You are logged in already');
        return res.redirect('/users/profile');
    }
}


exports.isLoggedIn = (req,res, next) => {
    if(req.session.user){
        return next();
    }else{
        req.flash('error','Please login to proceed');
        return res.redirect('/users/login');
    }
}

exports.isCreatedBy = (req, res, next) => {
    let id = req.params.id;
    mobile.findById(id)
    .then(data => {
        if(data){
            if(data.created_by == req.session.user){
                return next();
            }else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }else{
            let err = new Error('Unauthorized to access the resource');
            err.status = 401;
            return next(err);
        }
    })
    .catch(err => next(err));
}

exports.checkIfProductExisits = (req,res,next) => {
    let id = req.params.id;
    mobile.findById(id)
    .then(data => {
        if(data){
            if(data.created_by != req.session.user){
                return next();
            }else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }else{
            let err = new Error('Unauthorized to access the resource');
            err.status = 401;
            return next(err);
        }
    })
    .catch(err => next(err));
}

