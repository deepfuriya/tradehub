//modules
const { render } = require('ejs');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const siteRoutes = require('./routes/siteRoutes');
const appRoutes = require('./routes/appRoutes');
const userRoutes = require('./routes/userRoutes');



//app
const app = express();


//config
let port = 8080;
let host = 'localhost';
app.set('view engine','ejs');


//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(
    session({
        secret: "hhsfdywhdjvderuyhwejfgu3hbrycjytfur7hbgd",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60 * 60 * 1000 },
        store: new MongoStore({ mongoUrl: "mongodb://127.0.0.1:27017/phoneify" }),
    })
);

app.use(flash());

app.use((req, res, next) => {
res.locals.user = req.session.user || null;
  res.locals.successMessages = req.flash("success");
  res.locals.errorMessages = req.flash("error");
  next();
});


//connect to mongodb database
mongoose.connect('mongodb://127.0.0.1:27017/phoneify',{useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex: true})
.then(()=> {
    //server
    app.listen(port,host, () => {
        console.log('Server is running on port ',port);
    });
})
.catch(err=>console.log(err.message));


//routes

app.use('/',siteRoutes);

app.use('/users',userRoutes);

app.use('/trades',appRoutes);

app.use((req,res,next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => { 
    console.log(err.stack);
    if(!err.status){
        err.status = 500;
        err.message = ("Internal server error");
    }
    res.status(err.status);
    let headerValue = err.message;
    res.render('error',{error:err,headerValue:headerValue});
});



