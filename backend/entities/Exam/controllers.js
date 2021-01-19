const express = require('express');

const ExamService = require('./services.js');
const QuestionService = require('../Question/services.js');
const UserService = require('../Users/services.js');

const {
  validateFields
} = require('../../utils/verify.js');

const {
  runSQL
} = require('../../data/mysqlConnect.js')

const router = express.Router();
const moment = require('moment');

//start an evaluation session (teacher allows connection to test with testKey for testDuration)
router.post('/runTest', async (req, res, next) => {
  const {
    testKey,
    testDuration
  } = req.body;

  try {
    moment().format('MMMM Do YYYY, h:mm:ss a'); // May 26th 2020, 8:50:36 pm
    const startTime =  new Date();
    const endTime = moment(startTime).add(testDuration, 'm').toDate();
    const sessionId = await ExamService.runTest(testKey, startTime, endTime);
    res.status(201).json(sessionId);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

//show all results to teacherHome via query in database.Exam collection
router.post('/getResults', async (req, res, next) => {
  const {
    sessionId
  } = req.body;

  try {
    const data = await ExamService.getResults(sessionId);
    res.status(201).json(data);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

//check if student is allowed to take test (inspect database.Session collection)
router.post('/startTest', async (req, res, next) => {
  const {
    testKey
  } = req.body;

  try {
    //console.log("test attempted " + testKey);
    var currTime =  new Date();
    currTime = currTime.toISOString();
    const aux = await ExamService.startTest(testKey, currTime);
    //console.log(aux);
    res.send(aux);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});


router.post('/submit/MCQs', async (req, res, next) => {
  const {
    testKey,
    chosen_answers,
    userId,
    sessionId
  } = req.body;

  try {

    console.log(req.body);
    //console.log(sessionId);
    //console.log("testKey: " + testKey + "\nchosen_answers: " + chosen_answers + "\nuserId: " + userId);

    var data = [];
    const user = await UserService.getUser(userId);
    const mcqs = await QuestionService.getMCQ(testKey);

    if (chosen_answers.length === 0) {
      data =  await ExamService.storeMCQS(testKey, sessionId, user.name, user.email, -1, []);
    } else {
      const student_answers = [];
      const results = []
      //parse data received from user(student)
      for (let i = 0; i < chosen_answers.length; i++) {
        let questionId = chosen_answers[i].substr(0,24);
        let answerIndex = Number(chosen_answers[i].substr(25,25));
        student_answers.push({questionId, answerIndex});
      };

      //group answers by question
      var dict = [];
      for (let i = 0; i < student_answers.length; i++) {
        let key = student_answers[i].questionId;
        const indexes = [];
        for (let j = 0; j < student_answers.length; j++) {
          if (student_answers[j].questionId == key) {
            indexes.push(student_answers[j].answerIndex);
            student_answers.splice(j, 1);
            j -= 1;
          }
        }
        dict.push({id: key, answerIndexes: indexes});
        i -= 1;
      };

      //obtain index of each answer
      //for easier comparison with data received from user(student)
      const correct_answers = [];
      for (let i = 0; i < mcqs.length; i++) {
        var id = mcqs[i]._id;
        var answers = mcqs[i].answers;
        var correctAnswers = mcqs[i].correctAnswers;
        var select_correct_answers = [];
        for (let j = 0; j < correctAnswers.length; j++) {
          let index = answers.indexOf(correctAnswers[j]);
          if (index > -1) {
            select_correct_answers.push(index);
          }
        }
        correct_answers.push({id: String(id), answerIndexes: select_correct_answers});
      }

      //compare the 2 sets of data and calculate score
      //evaluate and save whether each question was solved correctly
      var score = 0;
      for (let i = 0; i < correct_answers.length; i++) {
        key = correct_answers[i].id;
        for (let j = 0; j < dict.length; j++) {
          let questionSolved = false;
          let questionCorrect = true;
          if (key == dict[j].id) {
            questionSolved = true;
            for (let k = 0; k < correct_answers[i].answerIndexes.length; k++) {
              if (dict[j].answerIndexes.indexOf(correct_answers[i].answerIndexes[k]) == -1) {
                questionCorrect = false;
                break;
              }
            }
            for (let k = 0; k < dict[j].answerIndexes.length; k++) {
              if (correct_answers[i].answerIndexes.indexOf(dict[j].answerIndexes[k]) == -1) {
                questionCorrect = false;
                break;
              }
            }

            if (questionSolved == true && questionCorrect == true) {
              score += 1;
              results.push({questionId: key, chosen_answers: dict[j].answerIndexes, correct_answers: correct_answers[i].answerIndexes, status: "correctly solved"});
            } else {
              results.push({questionId: key, chosen_answers: dict[j].answerIndexes, correct_answers: correct_answers[i].answerIndexes, status: "wrong answer"});
            }
          }
        }
      }

      const finalScore = score / correct_answers.length * 10;
      data =  await ExamService.storeMCQS(testKey, sessionId, user.name, user.email, finalScore, results);
    }


        //console.log(testKey + " " + sessionId + " " + user.name + " " + user.email + " " + score + " " + results);

        //console.log("final score: " + score + "/" + correct_answers.length + "=" + finalScore);


    res.send(data);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});


router.post('/submit/codeQuestions', async (req, res, next) => {
  const {
    examId,
    testKey,
    code_answers
  } = req.body;

  try {

    var data = [];

    if (code_answers.length === 0) {
      data =  await ExamService.storeCodeQs(examId, -1, []);
    } else {
      var score = 0;
      var results = [];
      const codeQuestions = await QuestionService.getCodeQuestion(testKey);
      //console.log(code_answers);
      //{ id: '5ec540455e10033c209e8c80', student_answer: 'select *' }
      for (let i = 0; i < code_answers.length; i++) {
        const key = code_answers[i].id;
        for (let j = 0; j < codeQuestions.length; j++) {
          questionSolved = false;
          questionCorrect = false;
          if (key == codeQuestions[j]._id) {
            if (code_answers[i].student_answer == "") {
              questionSolved = false;
              results.push({questionId: key, student_answer: code_answers[i].student_answer, status: "not solved"});
              break;
            } else {
              questionSolved = true;
              const output = await runSQL(code_answers[i].student_answer);
              const result = JSON.stringify(output);
              console.log(result);
              if (result == codeQuestions[j].referenceResult) {
                questionCorrect = true;
                score += 1;
                results.push({questionId: key, student_answer: code_answers[i].student_answer, correct_result: codeQuestions[j].referenceResult, result_obtained: result, status: "correctly solved"});
              }
              else {
                results.push({questionId: key, student_answer: code_answers[i].student_answer, correct_result: codeQuestions[j].referenceResult, result_obtained: result, status: "wrong answer"});
              }
            }
          }
        }
      }

      const totalScore = score / codeQuestions.length * 10;
      console.log("score: " + totalScore);
      console.log(results);

      data =  await ExamService.storeCodeQs(examId, totalScore, results);
    }

    res.send(data);
    res.status(201).end();
  } catch (err) {
    //res.send(err);
    console.log(err);
    next(err);
  }
});

module.exports = router;
