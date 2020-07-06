const express = require('express');
const passport = require('passport');
const userRouter = express.Router();
var User = require('../models/user');
const bcrypt= require('bcryptjs');
userRouter.get('/login', (req,res,next) => {res.render('login')});

userRouter.get('/register', (req,res,next) => {res.render('register')});

userRouter.post('/register', (req,res,next) => {
    const {name, email,password,password2} = req.body;

    let errors = [];
    
    //Check Required Fields
    if(!name || !email || !password || !password2) {
        errors.push({msg : 'Please fill in all the fields'});
    }
    //Check Password
    if(password!=password2){
        errors.push({msg:'Passwords do not match'});
    }
    if(password.length<6){
        errors.push({msg : 'Password should be atleast 6 characters'});
    }
    if(errors.length > 0) {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else {
        // Validation Passed

        User.findOne({email : email})
        .then((user) => {
            if(user) {                  //User Exists
                errors.push({msg : "Email is already Registered"})
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else {
                const newUser = new User({
                    name : name,
                    email : email,
                    password : password
                });
                // Hash Password

                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        if(err) throw err;
                        // Set Password to Hashed
                        newUser.password = hash;
                        
                        newUser.save()
                        .then((user) => {
                            req.flash('success_msg','You are now registered and can log in');
                            res.redirect('/users/login');
                        })
                        .catch((err) => console.log(err));
                    })
                })
            }
        })
    }
});

// Login Handle
userRouter.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
})

// Logout Handle
userRouter.get('/logout', (req,res,next) => {
    req.logOut();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login')
})
module.exports = userRouter;