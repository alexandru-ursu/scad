"use strict";

const {
  MCQuestion, CodeQuestion, Exam, Session, Users
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


const runTest = async (testKey, startTime, endTime) => {
  const session = new Session({
    testKey,
    startTime,
    endTime,
  });
  const data = await session.save();
  //console.log(data._id);
  return data._id;
};


const getResults = async (sessionId) => {
  //console.log("sessionId: " + sessionId);
  const data = await Exam.find({"sessionId":sessionId});
  if (data === null) {
    throw new ServerError(`No submited tests found for session: ${sessionId}`, 404);
  }
  // console.log("service get Result data:");
  // console.log(data);
  // console.log("------------------------------");
  return data;
};


const startTest = async (testKey, currTime) => {
  //console.log(testKey + "    " + currTime);
  const data = await Session.find({"testKey": testKey, "endTime": {$gt: currTime}, "startTime": {$lt: currTime}});
  console.log("service data:" + data);
  if (data == null || data == "") {
    //throw new ServerError(`No submited tests found for session: ${data.sessionId}`, 404);
    return "not allowed";
  }
  return data;
};


const storeMCQS = async(testKey, sessionId, name, email, score, results) => {
  const check = await Exam.find({"testKey": testKey, "sessionId": sessionId, "studentEmail": email, "studentName": name});
  //console.log(check);
  if (check == null || check == "") {
    const exam = new Exam({
      testKey: testKey,
      sessionId: sessionId,
      studentName: name,
      studentEmail: email,
      mcqs_score: score,
      mcqs_results: results,
      final_score: 0
    });
    const data = await exam.save();
    //console.log(data._id);
    return data._id;
  } else {
    console.log("Test already submited");
    return "Test already submited";
  }
}

const storeCodeQs = async(examId, score, results) => {
  var check = await Exam.find({_id: examId},{_id:0, mcqs_score: 1});
  console.log(examId);
  console.log(check[0]);
  var finalScore = 0;
  if (check[0].mcqs_score === -1 && check[0].code_score !== -1) {
    finalScore = score;
  } else if (check[0].code_score === -1 && check[0].mcqs_score !== -1) {
    finalScore = check[0].mcqs_score;
  } else if (check[0].code_score !== -1 && check[0].mcqs_score !== -1) {
    finalScore = (check[0].mcqs_score + score) / 2;
  }

  await Exam.updateOne({_id: examId},{$set:{code_score: score, code_results: results, final_score: finalScore}},{ upsert: true });

  return {mcqs_score: check[0].mcqs_score, code_score: score, finalScore: finalScore};
}



module.exports = {
  runTest,
  getResults,
  startTest,
  storeMCQS,
  storeCodeQs
}
