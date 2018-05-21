const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  first_name:{
    type: String,
    required: true
  },
  
  last_name:{
    type: String,
    required: true
  },

  user_id:{
      type: Number,
      min:100000,
      max:999999,
      require:true
  },

  godlike_power:{
    type: Number,
    min : 1,
    max : 5,
    required: true
  },

  password:{
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('user_schema', UserSchema);