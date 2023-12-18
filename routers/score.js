const { Router } = require('express');

const scoreController = require('../controllers/score.js');

const scoreRouter = Router();

scoreRouter.get("/", scoreController.index);
scoreRouter.get("/:token", scoreController.show);
scoreRouter.post("/", scoreController.create);
scoreRouter.patch("/:token", scoreController.update);



module.exports = scoreRouter;
