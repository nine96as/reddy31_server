const { Router } = require('express');

const authenticator = require('../middleware/authenticator');
const noteController = require('../controllers/note');

const noteRouter = Router();

noteRouter.get('/', authenticator, noteController.index);
noteRouter.post('/', noteController.create);
noteRouter.get('/:id', noteController.show);
noteRouter.patch('/:id', noteController.update);
noteRouter.delete('/:id', noteController.destroy);

module.exports = noteRouter;
