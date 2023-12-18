const { Router } = require('express');

const questionController = require('../controllers/question');

const questionRouter = Router();

questionRouter.get('/', questionController.index);
questionRouter.post('/', questionController.create);
questionRouter.delete('/:id', questionController.destroy);

module.exports = questionRouter;
