const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MCQSchema = new Schema({
  testKey: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  answers: {
    type: Array,
    required: true
  },
  correctAnswers: {
    type: Array,
    required: true
  }
}, { timestamps: true });

const MCQModel = mongoose.model('MCQ', MCQSchema);
module.exports = MCQModel;
