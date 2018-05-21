const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const Att = new Schema({

  class_id:{
    type: String,
    required: true
  },

  user_id:{
      type: String,
      require:true
  },

  dateIn: {
    type: Date,
    default: Date.now
  },

  dateOut: {
    type: Date
  }
});

mongoose.model('attendance_schema', Att);