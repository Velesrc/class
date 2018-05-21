const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ClassSchema = new Schema({

  class_id:{
    type: String,
    required: true
  },

  user_id:{
      type: String,
      require:true
  }
});

mongoose.model('assign_schema', ClassSchema);