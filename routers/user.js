const { Router } = require('express');

const userController = require('../controllers/user');

const userRouter = Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/logout', userController.logout);

module.exports = userRouter;
