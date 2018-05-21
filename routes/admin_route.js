const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/user_model');
const User = mongoose.model('user_schema');


 // Get register
 router.get('/register', (req, res) => {
    res.render('admin/register');
})
// Post register 

router.post('/register', (req, res) => {
 // console.log(req.body);
  let error = [];
  //error.push('Test')

  if(error.length > 0){

    res.render('/register', {
      //error: error,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      user_id: req.body.user_id,
      password: req.body.password,
    });

  } else {
    User.findOne({user_id: req.body.user_id})
      .then(user => {
        if(user){
          console.log('Id already registered');
          res.redirect('/register');
        } else {
          const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            user_id: req.body.user_id,
            godlike_power: req.body.user_role,
            password: req.body.password
          });
          //console.log(newUser);
          newUser.save()
          .then(user => {
            console.log('User registered');
            res.redirect('/');
          })

        }
      });
  }
});


module.exports = router;