const { Router } = require('express');

const scoreController = require('../controllers/score.js');

const scoreRouter = Router();

scoreRouter.get('/', scoreController.index);
scoreRouter.get('/token/:token', scoreController.show);
scoreRouter.get('/subject/:subject', scoreController.showBySubject);
scoreRouter.post('/', scoreController.create);
scoreRouter.patch('/:token', scoreController.update);

module.exports = scoreRouter;
