const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CodeQuestionSchema = new Schema({
  testKey: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createTableStatement: {
    type: String,
    required: false
  },
  insertStatement: {
    type: String,
    required: false
  },
  correctAnswer: {
    type: String,
    required: true
  },
  referenceResult: {
    type: Array,
    required: false
  }
}, { timestamps: true });

const CodeQuestionModel = mongoose.model('CodeQuestion', CodeQuestionSchema);
module.exports = CodeQuestionModel;
