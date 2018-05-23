const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const qr = require('qrcode');
const router = express.Router();

// Load helpers for check Authentication
const {ensureAuthenticated} = require('../helpers/auth');
const {RoleStudent} = require('../helpers/auth');

// Load DB models
require('../models/user_model');
const User = mongoose.model('user_schema');

require('../models/class_students')
const Assign = mongoose.model('assign_schema');

require('../models/class_model')
const Class = mongoose.model('class_schema');

 // ======================= Student Get and Post =======================
 router.get('/schedule', RoleStudent, (req, res) => {

    Assign.find({user_id: req.session.passport.user})
    .then(Classes => {
    
        const ClassArray = {};
        ClassArray._id = [];
        for(let elem in Classes) 
        {
                ClassArray._id.push(Classes[elem].class_id);
        }

        Class.find(ClassArray, (err, AllStudentClasses) => {

            let TodayDayOfWeek = new Date().getDay();

            const DayArrStart = ['Start_Sun', 'Start_Mon', 'Start_Tue', 'Start_Wed', 'Start_Thu', 'Start_Fri', 'Start_Sut'];
            const DayArrEnd = ['End_Sun', 'End_Mon', 'End_Tue', 'End_Wed', 'End_Thu', 'End_ri', 'End_Sut'];

            // Terrible Things but i hope it's temporary 
            // Transfor Day under our db
            if(TodayDay == 0) {
                TodayDay = 7;
            } 

            const ValidatedClassesArr = [];
            for(let i = 0, len = AllStudentClasses.length; i < len; i++)
            {
            
               let SpecClass = AllStudentClasses[i];
             
               for(let i = 0; i <= 6; i++)
               {
            
                   if(SpecClass[DayArrStart[i]] != 'None')
                   {
                        ValidatedClassesArr.push ({
                            Class: SpecClass.class_name,
                            [DayArrStart[i]]: SpecClass[DayArrStart[i]],
                            [DayArrEnd[i]] : SpecClass[DayArrEnd[i]]
                        });
                   }
               }
                 
            }
          
            const FinishedClassArr = [];

            for(let DayOfWeel in ValidatedClassesArr)
            {  
                for(var i = 0; i < 7; i++) {
                    var week = 0;
                    if(ValidatedClassesArr[DayOfWeel][DayArrStart[TodayDayOfWeek + week]] != undefined) 
                    {
                        ValidatedClassesArr[DayOfWeel].left = i
                        FinishedClassArr.push(ValidatedClassesArr[DayOfWeel] );
                    }
                    if(TodayDayOfWeek + week == 6) {
                        TodayDayOfWeek = 0;
                    }
                }
            }
            //console.log(FinishedClassArr);
            //=========================================
        })
    })
    res.render('student/schedule', {
        role1 : true
    });
})

router.get('/attendance', RoleStudent, (req, res) => {
    res.render('student/attendance', {
        role1 : true
    });
})



router.get('/qr',ensureAuthenticated, RoleStudent, (req, res) => {
  //  console.log(req.session.passport.user + ' qr code');

    User.findById(req.session.passport.user, (err, user_obj) => {
      //console.log('The return of db is ' + user_obj);
      qr.toDataURL( `http://172.16.10.60:5111/student/qr/in/${user_obj._id}` , (err, url) => {
        res.render('student/qr', {
          role1: true,
          qr_url : url
        })
      })
    })
})


router.get('/qr/in/*' , (req, res) => {

    let classid = req.url.split('/')[3];
    const UserArr2 = {};
    UserArr2._id = classid
    Assign.find({user_id:UserArr2._id })
    .then(Classes => {
      
        const ClassArray2 = {};
        ClassArray2._id = [];
        for(let elem in Classes) 
        {
                ClassArray2._id.push(Classes[elem].class_id);
        }

        Class.find(ClassArray2, (err, AllStudentClasses2) => {
            let TodayDate = new Date();
            let TodayDayOfWeek = TodayDate.getDay();
            const DayArrStart2 = ['Start_Sun', 'Start_Mon', 'Start_Tue', 'Start_Wed', 'Start_Thu', 'Start_Fri', 'Start_Sut'];
          
           

            const ValidatedClassesArr2 = [];
            for(let i = 0, len = AllStudentClasses2.length; i < len; i++)
            {
            
               let SpecClass = AllStudentClasses2[i];
             
               for(let i = 0; i <= 6; i++)
               {
            
                   if(SpecClass[DayArrStart2[i]] != 'None')
                   {
                        ValidatedClassesArr2.push ({
                            Class: SpecClass.class_name,
                            [DayArrStart2[i]]: SpecClass[DayArrStart2[i]],
                            _id:SpecClass._id
                        });
                   }
               }
                 
            }
            for(let ele in ValidatedClassesArr2)
            {
                if(DayArrStart2[TodayDayOfWeek] in ValidatedClassesArr2[ele])
                {
                    
                    console.log(ValidatedClassesArr2[ele]);
                   
                    res.render('student/attendance', {
                        mess : `You are came in ${ValidatedClassesArr2[ele].Class} class  that starting ${ValidatedClassesArr2[ele][DayArrStart2[TodayDayOfWeek]]}`,
                        role1 : true
                    });
                    return;
                }
            }
           
        
    

        })
    })

})


module.exports = router;