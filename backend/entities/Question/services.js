"use strict";

const {
  MCQuestion
} = require('../../data/connection.js');

const {
  CodeQuestion
} = require('../../data/connection.js');

const {
  generateToken
} = require('../../security/Jwt/index.js');

const {
  ServerError
} = require('../../utils/error.js');

const {
  hash,
  compare
} = require('../../security/Password/index.js');

const {
  sendEmail
} = require('../../utils/email.js')

const {
  runSQL
} = require('../../data/mysqlConnect.js')


const addMCQ = async (testKey, body, answers, correctAnswers) => {
  const question = new MCQuestion({
    testKey,
    body,
    answers,
    correctAnswers
  });
  await question.save();
};


const getMCQ = async (testCode) => {
  const data = await MCQuestion.find({"testKey":testCode});
  if (data === null) {
    throw new ServerError(`No questions with testKey ${testCode} found`, 404);
  }
  return data;
};


const deleteMCQ = async (id) => {
  try {
    await MCQuestion.deleteOne({"_id":id});
  } catch (err) {
    throw new ServerError(err, 404);
  }
};


const addCodeQuestion = async (testKey, body, createTableStatement, insertStatement, correctAnswer) => {

  if (createTableStatement != "") await runSQL(createTableStatement);
  if (insertStatement != "") await runSQL(insertStatement);
  const output = await runSQL(correctAnswer);
  const referenceResult = JSON.stringify(output);
  //console.log(output);

  const question = new CodeQuestion({
    testKey,
    body,
    createTableStatement,
    insertStatement,
    correctAnswer,
    referenceResult
  });

  try {
    await question.save();
  } catch (err) {
    throw new ServerError(err, 404);
  }
};


const getCodeQuestion = async (testCode) => {

  const data = await CodeQuestion.find({"testKey":testCode});
  if (data === null) {
    throw new ServerError(`No questions with testKey ${testCode} found`, 404);
  }
  return data;
};


const deleteCodeQ = async (id) => {

  try {
    await CodeQuestion.deleteOne({"_id":id});
  } catch (err) {
    throw new ServerError(err, 404);
  }
};


const getTests = async () => {

  var codeQData = await CodeQuestion.aggregate([ {$group:{"_id":"$testKey",questions:{$sum:1},createdOn:{$min:"$createdAt"}}}]);
  codeQData = JSON.parse(JSON.stringify(codeQData));
  if (codeQData === null) {
    throw new ServerError(`No questions with testKey ${testCode} found`, 404);
  }
  var mcqsData = await  MCQuestion.aggregate([ {$group:{"_id":"$testKey",questions:{$sum:1},createdOn:{$min:"$createdAt"}}}]);
  mcqsData = JSON.parse(JSON.stringify(mcqsData));
  if (mcqsData === null) {
    throw new ServerError(`No questions with testKey ${testCode} found`, 404);
  }

  const data = [];

  for (var i in codeQData) {
    var aux = {_id :codeQData[i]._id, codeQuestions: codeQData[i].questions, mcqs: 0, createdOn: codeQData[i].createdOn};

    var found = false;
    for (var j in mcqsData) {
      if (aux._id == mcqsData[j]._id) {
        found = true;
        aux.mcqs = mcqsData[j].questions;
        data.push(aux);
        mcqsData[j].questions = -1;
        break;
      }
    }
    if (found === false) {
      data.push(aux);
    }

  }

  for (var i in mcqsData) {
    if (mcqsData[i].questions != -1) {
      var aux = {_id :mcqsData[i]._id, codeQuestions: 0, mcqs: mcqsData[i].questions, createdOn: mcqsData[i].createdOn};
      data.push(aux);
    }
  }


  //console.log(data);
  return data;
};

module.exports = {
  addMCQ,
  getMCQ,
  addCodeQuestion,
  getCodeQuestion,
  deleteMCQ,
  deleteCodeQ,
  getTests
}
