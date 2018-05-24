const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ClassSchema = new Schema({

  Class_Id:{
    type: String,
    required: true
  },

  
  User_Id:{
      type: String,
      require:true
  },

  Class_Name:{
    type: String,
    required: true
  },

  
  User_Name:{
      type: String,
      require:true
  }
});

mongoose.model('assign_schema', ClassSchema);