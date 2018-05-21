const LocalStrategy  = require('passport-local').Strategy;
const mongoose = require('mongoose');

// Load user model
require('../models/user_model');
const User = mongoose.model('user_schema');

module.exports = function(passport){
    
  passport.use(new LocalStrategy((username, password, done) => {
    // Match user
    User.findOne({
      user_id:username
    }).then(user => {
      if(!user){
        return done(null, false, {message: 'User not Found'});
      } 

      // Match password
      if(password != user.password)
      {
        return done(null, false, {message: 'Password Incorrect'});
      } else {
        return done(null, user);
      }
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
