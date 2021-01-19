const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExamSchema = new Schema({
  testKey: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: false
  },
  mcqs_score: {
    type: Number,
    required: false
  },
  mcqs_results: {
    type: Array,
    required: false
  },
  code_score: {
    type: Number,
    required: false
  },
  code_results: {
    type: Array,
    required: false
  },
  final_score: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const ExamModel = mongoose.model('Exams', ExamSchema);
module.exports = ExamModel;
