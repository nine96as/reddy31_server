const { Router } = require('express');

const userController = require('../controllers/user.js');

const userRouter = Router();

userRouter.get("/", userController.index);
userRouter.get("/:id", userController.show);
userRouter.post("/", userController.create);
userRouter.patch("/:id", userController.update);
userRouter.delete("/:id", userController.destroy);

module.exports = userRouter;