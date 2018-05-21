module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/');
  },
     RoleTeacher: function(req, res, next){
      const mongoose = require('mongoose');
      require('../models/user_model');
      const User = mongoose.model('user_schema');

    User.findOne({_id: req.session.passport.user})
    .then(user => {
      if(user.godlike_power == 2){
        return next();
      } else { 
        req.flash('error_msg', 'Wrong Role');
         res.redirect('/');
      } 
    })
  } ,

  RoleStudent: function(req, res, next){
    const mongoose = require('mongoose');
    require('../models/user_model');
    const User = mongoose.model('user_schema');

  User.findOne({_id: req.session.passport.user})
  .then(user => {
    if(user.godlike_power == 1){
      return next();
    } else { 
      req.flash('error_msg', 'Wrong Role');
       res.redirect('/');
    } 
  })
} 
}
