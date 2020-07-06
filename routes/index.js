const express = require('express');
const indexRouter = express.Router();
const { ensureAuthenticated } = require('../config/auth')
// Welcome Page
indexRouter.get('/',(req,res,next) => {res.render('welcome')});

//Dashboard
indexRouter.get('/dashboard',ensureAuthenticated, (req,res,next) =>
{
    res.render('dashboard', {
        name : req.user.name
    });
    
});
module.exports = indexRouter;