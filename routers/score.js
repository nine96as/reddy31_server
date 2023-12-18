const { Router } = require('express');

const scoreController = require('../controllers/score.js');

const scoreRouter = Router();

scoreRouter.get("/", scoreController.index);
scoreRouter.get("/:userId", scoreController.show);
scoreRouter.post("/", scoreController.create);
scoreRouter.patch("/:userId", scoreController.update);



module.exports = scoreRouter;
