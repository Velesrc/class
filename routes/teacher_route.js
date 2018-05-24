const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

// Load helpers for check Authentication
const {ensureAuthenticated} = require('../helpers/auth');
const {RoleTeacher} = require('../helpers/auth');

// ================ Load DB models ========================
require('../models/user_model');
const User = mongoose.model('user_schema');

require('../models/class_model')
const Class = mongoose.model('class_schema');

require('../models/class_population')
const Assign = mongoose.model('assign_schema');
// ================================== class branch ========================================

// Get list of Classes
router.get('/class/list',ensureAuthenticated, RoleTeacher, (req, res) => {

    Class.find({})
    .then( class_name => {
        res.render('teacher/class', {
        class_name : class_name,
        role2: true
        })
    })
})

router.get('/class/info/:id',ensureAuthenticated, RoleTeacher, (req, res) => {
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

// Assign student to class
router.post('/class/add',ensureAuthenticated, RoleTeacher, (req, res) => {
   
    // Input student - _id Class - Class_Name
    Assign.find({Class_Name : req.body.ClassName})
    .then( ReturnedClasses => {

        // If Class is not emty
        if(ReturnedClasses) 
        {
            let err = []; 

            for(let SpecClass in ReturnClasses)
            {
                if(SpecClass.User_Id == req.body.UserId)
                {
                    console.log('Student Already in Class');
                    err.push('Student Already in Class')

                }
            }
        

            User.findOne({ _id:UserId})
                .then( ReturnedStudent => {
                    
                    let NewStudentAssign = new Assign({
                        Class_Id : ReturnedClasses._id,
                        Class_Name : ReturnedClasses.Class_Name,
                        User_Id : ReturnedStudent._id,
                        User_Name : ReturnedStudent.User_Name
                    });

                    NewStudentAssign.save()
                    .then(Saved => {
                        console.log('Student Assign');
                         res.redirect('/teacher/class/create');
                    })
                })
        } else {
            // If Class Emty
            Class.findOne({ Class_Name: req.body.ClassName })
            .then( ReturnedClass => {
                // Check if this class is exist
                if(ReturnedClass)
                {
                    User.findOne({ _id:UserId})
                    .then( ReturnedStudent => {
                        
                        let NewStudentAssign = new Assign({
                            Class_Id : ReturnedClasse._id,
                            Class_Name : ReturnedClasse.Class_Name,
                            User_Id : ReturnedStudent._id,
                            User_Name : ReturnedStudent.User_Name
                        });

                        NewStudentAssign.save()
                        .then(Saved => {
                            console.log('Student Assign');
                            res.redirect('/teacher/class/create');
                        })
                    })
                }
            })

        }
    })
});

router.get('/class/add',ensureAuthenticated, RoleTeacher, (req, res) => {
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
 router.get('/class/create',ensureAuthenticated,  RoleTeacher,(req, res) => {
    res.render('teacher/create', {
        role2: true
    });
})

router.post('/class/create',ensureAuthenticated, RoleTeacher, (req, res) => {
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

router.get('/student/list', ensureAuthenticated, RoleTeacher, (req, res) => {
    User.find({godlike_power: 1})
        .then( student_ => {
            res.render('teacher/student_list', {
            student_ : student_,
            role2: true
        })
    })
})

router.get('/student/list/:id', ensureAuthenticated, RoleTeacher, (req, res) => {
    let StudentIdFromURL = req.url.split('/')[3];

    {}
});
// Post register  Same with admin but always make role:Student
router.post('/register',ensureAuthenticated, RoleTeacher,(req, res) => {
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