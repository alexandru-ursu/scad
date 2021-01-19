const Router = require('express')();

const UsersController = require('./entities/Users/controllers.js');
const ExamController = require('./entities/Exam/controllers.js');
const QuestionController = require('./entities/Question/controllers.js');

Router.use('/exam', ExamController);
Router.use('/users', UsersController);
Router.use('/questions', QuestionController);

module.exports = Router;
