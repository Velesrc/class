const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('./helpers/auth');


const app = express();



// Load routes 
const admin = require('./routes/admin_route');
const teacher = require('./routes/teacher_route');
const student = require('./routes/student_route');

// Passport Config
require('./config/passport')(passport);

// Something with warnings 
mongoose.Promise = global.Promise;

// Connect to database
mongoose.connect('mongodb://localhost/class-dev')
    .then(console.log('Data base is conected'))
    .catch( err => console.log(err + ' while connecting to database'));

// Load User Model
require('./models/user_model');
const User = mongoose.model('user_schema');

// Setup for templet-engine    Main file in /views/layouts/main.handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
  }));
  app.set('view engine', 'handlebars');

// Body parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override setup
app.use(methodOverride('_method'));

// Express session and secret key setup 
app.use(session({
    secret: 'IloveMyLittlePony :D',
    resave: true,
    saveUninitialized: true
  }));

  // Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Flash messeges setup
app.use(flash());

// Setup variables for flash messeges
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });

// Finish Setup :)

// Index route
app.get('/', (req, res) => {
    res.render('other/login', {
        login_page : true
    });
});

app.get('/success', (req, res) => {
    User.findOne({
        _id:req.session.passport.user
      }).then(user => {
         switch(user.godlike_power) 
         {
             case 1:
                res.redirect('student/schedule')
             break;

             case 2:
             res.redirect('teacher/class/list')
             break;

             case 3:

             break;

             case 4:
             res.redirect('/admin/register')
             break;
         }

      });
})

// Login Form POST
app.post('/login', (req, res, next) => {
    //console.log(req.body);
    passport.authenticate('local', {
      successRedirect:'/success',
      failureRedirect: '/',
      failureFlash: true
    })(req, res, next);
  });

// Before we just load routes. Right now we use it
app.use('/admin', admin);
app.use('/teacher', teacher);
app.use('/student', student);

app.get('/in/:id', (req,res) => {
    console.log(req.param);
})

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });

  app.get('*', function(req, res) {
    res.redirect('/');
 });

// Start server
const port = 5111;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});