const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();
const {RoleTeacher} = require('../helpers/auth');
// Load User Model
require('../models/user_model');
const User = mongoose.model('user_schema');

require('../models/class_model')
const Class = mongoose.model('class_schema');


require('../models/class_students')
const Assign = mongoose.model('assign_schema');
// ================================== class branch ========================================
 // Class
router.get('/class/list',RoleTeacher, (req, res) => {

    Class.find({})
    .then( class_name => {
        res.render('teacher/class', {
        class_name : class_name,
        role2: true
    })

})
})

router.get('/class/info/:id',RoleTeacher, (req, res) => {
    let classid = req.url.split('/')[3];
    const UserArr = {};
    UserArr._id = []
  //  console.log(classid);
    Assign.find({class_id : classid})
    .then( classes => {
    
        for(let i = 0, len = classes.length; i < len; i++) 
        {
            UserArr._id.push(classes[i].user_id); 

        }
       
       User.find(UserArr, (err, usersArray) => {
           
        Class.findById(classes[0].class_id)
        .then( ClassArr => {
            //console.log(ClassArr);
            res.render('teacher/info', {
                ClassArr : ClassArr,
                usersArray : usersArray,
                role2: true
            });
        })
                   
               
       })
   
   
        
    })

})

router.post('/class/add', (req, res) => {
   console.log(req.body.class[0]);

   Class.findOne({class_name : req.body.class[0]})
    .then( class_obj => {
        let nameArr = req.body.class[1].split(' ')
        let first_name = nameArr[0];
        User.findOne({first_name:first_name})
            .then( student_ => {
              if(student_ != null && student_ != undefined && class_obj != null && class_obj != undefined)
              {
                const newAssign = new Assign({
                    class_id:class_obj._id,
                    user_id:student_._id
                });
                
                newAssign.save().then(res.redirect('/teacher/class/list'))
              }
            })
    })
});

router.get('/class/add',RoleTeacher, (req, res) => {
    Class.find({})
    .then( class_name => {
        User.find({godlike_power: 1})
            .then( student_ => {
            res.render('teacher/add', {
            student_ : student_,
            class_name : class_name,
            role2: true
        })
    })
})
});


 // Class
 router.get('/class/create', RoleTeacher,(req, res) => {
    res.render('teacher/create', {
        role2: true
    });
})

router.post('/class/create', RoleTeacher, (req, res) => {
    // Validation 
    console.log(req.body);
   const RegExpForTime = /^(10|11|12|[1-9]):[0-5][0-9]$/;
   const CreateClassArr = req.body;
   const validatedCreateClassArr = {};
    for (let key in CreateClassArr)
    {
        // Check name
        if(key == 'ClassName') 
        {
            validatedCreateClassArr[key] = CreateClassArr[key] ;
        } else {
        
        // Check time
        
           let tmp_time = CreateClassArr[key];
           console.log(tmp_time);
           
                let validatedTime = tmp_time.match(RegExpForTime);

                if(validatedTime != null) 
                {
                    validatedCreateClassArr[key] = validatedTime[0];
                    console.log(validatedCreateClassArr);
                } else {
                    validatedCreateClassArr[key] = 'None';
                }
            
        }
        console.log(validatedCreateClassArr);
    };
    // Register class in DataBase
    
    Class.findOne({class_name : validatedCreateClassArr.ClassName}).then(class_ => {
        if(class_) {
        console.log('Class already registered');
        res.redirect('/teacher/class/create');
        return;
        } else {
            const NewClass = new Class({
                class_name : validatedCreateClassArr.ClassName,
                Start_Mon : validatedCreateClassArr.start_mon,
                Start_Tue : validatedCreateClassArr.start_tue,
                Start_Wed : validatedCreateClassArr.start_wed,
                Start_Thu : validatedCreateClassArr.start_thu,
                Start_Fri : validatedCreateClassArr.start_fri,
                Start_Sut : validatedCreateClassArr.start_sut,
                Start_Sun : validatedCreateClassArr.start_sun,
                End_Mon : validatedCreateClassArr.end_mon,
                End_Tue : validatedCreateClassArr.end_tue,
                End_Wed : validatedCreateClassArr.end_wed,
                End_Thu : validatedCreateClassArr.end_thu,
                End_Fri : validatedCreateClassArr.end_fri,
                End_Sut : validatedCreateClassArr.end_sut,
                End_Sun : validatedCreateClassArr.end_sun,
            });

            NewClass.save()
                .then(class_ => {
                console.log('Class registered');
                 res.redirect('/teacher/class/create');
          })
        }
    })

});
// ================================== Student branch ========================================
 // Register Student
 router.get('/student/register', (req, res) => {
    res.render('teacher/register', {
        role2: true
    });
})

router.get('/student/list', RoleTeacher, (req, res) => {
    User.find({godlike_power: 1})
    .then( student_ => {
        res.render('teacher/student_list', {
        student_ : student_,
        role2: true
    })
})
})
// Post register  Same with admin but always make role:Student
router.post('/register', RoleTeacher,(req, res) => {
 // console.log(req.body);
  let error = [];


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
            godlike_power: 1,
            password: req.body.password
          });
          //console.log(newUser);
          newUser.save()
          .then(user => {
            console.log('User registered');
            res.redirect('/teacher/student/list');
          })

        }
      });
  }
});


module.exports = router;