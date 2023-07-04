const { render } = require('ejs');

exports.mainPage = (req,res) => {
    let headerValue = 'iPhoneify';
    res.render('index',{headerValue});
};

exports.aboutPage = (req,res) => {
    let headerValue = 'ABOUT US';
    res.render('about',{headerValue});
};

exports.contactPage = (req,res) => {
    let headerValue = 'CONTACT US';
    res.render('contact',{headerValue});
};



