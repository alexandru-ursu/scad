const mongoose = require('mongoose');

(async () => {
  try {

    console.log("Connecting to mongo: " + `mongodb://${process.env.MUSER}:${process.env.MPASSWORD}@${process.env.MHOST}:${process.env.MPORT}/${process.env.MDATABASE}`);
    await mongoose.connect(`mongodb://${process.env.MUSER}:${process.env.MPASSWORD}@${process.env.MHOST}:${process.env.MPORT}/${process.env.MDATABASE}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
  } catch (e) {
    console.trace(e);
    console.log(e);
  }
})();

const Users = require('./models/User.js');
const MCQuestion = require('./models/MCQuestion.js');
const CodeQuestion = require('./models/CodeQuestion.js');
const Session = require('./models/Session.js');
const Exam = require('./models/Exam.js');

module.exports = {
  Users,
  MCQuestion,
  CodeQuestion,
  Exam,
  Session
}
