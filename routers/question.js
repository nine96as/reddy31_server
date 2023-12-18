const { Router } = require('express');

const questionController = require('../controllers/question');

const questionRouter = Router();

questionRouter.get('/', questionController.index);

module.exports = questionRouter;
