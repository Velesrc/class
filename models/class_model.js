const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ClassSchema = new Schema({

  Class_Name:{
    type: String,
    required: true
  },

  Students_In_Class:{
    type: Number,
    required: true
  },

  Students_In_Class_Today:{
    type: Number,
    required: true
  },

  Last_Update:{
    type: Date,
    required: true
  },

  Start_Mon:{
      type: String,
      require:false
  },

  Start_Tue:{
    type: String,
    require:false
  },
  
  Start_Wed:{
    type: String,
    require:false
  },

  Start_Thu:{
    type: String,
    require:false
  },

  Start_Fri:{
    type: String,
    require:false
  },

  Start_Sut:{
    type: String,
    require:false
  },

  Start_Sun:{
    type: String,
    require:false
  },
  End_Mon:{
    type: String,
    require:false
 },

End_Tue:{
  type: String,
  require:false
},

End_Wed:{
  type: String,
  require:false
},

End_Thu:{
  type: String,
  require:false
},

End_Fri:{
  type: String,
  require:false
},

End_Sut:{
  type: String,
  require:false
},

End_Sun:{
  type: String,
  require:false
}
});

mongoose.model('class_schema', ClassSchema);