const express = require('express');

const QuestionService = require('./services.js');

const {
  validateFields
} = require('../../utils/verify.js');

const router = express.Router();

//add a multiple Choince Question via insert into database
router.post('/add/MCQ', async (req, res, next) => {
  const {
    testKey,
    body,
    answers,
    correctAnswers
  } = req.body;

  try {
    const answersList = answers.split(';');
    const correctAnswersList = correctAnswers.split(';');
    await QuestionService.addMCQ(testKey, body, answersList, correctAnswersList);
    res.send('Question added');
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

//return all multiple choince questions
router.post('/get/MCQ', async (req, res, next) => {
  const {
    testKey
  } = req.body;

  try {
    //console.log("getMCQ: " + testKey);
    const data = await QuestionService.getMCQ(testKey);
    res.status(200).json(data);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

//delete a multiple choice question from database
router.post('/delete/MCQ', async (req, res, next) => {
  const {
    _id
  } = req.body;

  try {
    await QuestionService.deleteMCQ(_id);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

//add a code question via insert into database
router.post('/add/CodeQ', async (req, res, next) => {
  const {
    testKey,
    body,
    createTableStatement,
    insertStatement,
    correctAnswer
  } = req.body;

  try {
    const data = await QuestionService.addCodeQuestion(testKey, body, createTableStatement, insertStatement, correctAnswer);
    res.send("Question added");
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

//return all code questions
router.post('/get/CodeQ', async (req, res, next) => {
  const {
    testKey
  } = req.body;

  try {
    const data = await QuestionService.getCodeQuestion(testKey);
    res.status(200).json(data);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

//delete a code question from database
router.post('/delete/CodeQ', async (req, res, next) => {
  const {
    _id
  } = req.body;

  try {
    await QuestionService.deleteCodeQ(_id);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

//return basic data of each test in database
//output format: {testKey, no of multiple choice questions, no of code questions, date of creation}
router.get('/get/alltests', async (req, res, next) => {
  try {
    const data = await QuestionService.getTests();
    res.status(200).json(data);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
