const { Router } = require('express');

const subjectController = require('../controllers/subject');

const subjectRouter = Router();

subjectRouter.get('/', subjectController.indexByUser);
subjectRouter.post('/', subjectController.create);
subjectRouter.patch('/:id', subjectController.destroy);

module.exports = subjectRouter;
