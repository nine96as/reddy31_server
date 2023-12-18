const { Router } = require('express');

const subjectController = require('../controllers/subject');

const subjectRouter = Router();

subjectRouter.get('/', subjectController.index);
subjectRouter.post('/', subjectController.create);
subjectRouter.patch('/:id', subjectController.destroy);

module.exports = subjectRouter;
