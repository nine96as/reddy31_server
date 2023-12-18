const { Router } = require('express');

const answerController = require('../controllers/answer');

const answerRouter = Router();

answerRouter.get('/:id', answerController.showByQuestion);
answerRouter.post('/', answerController.create);

module.exports = answerRouter;
