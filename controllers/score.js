const Score = require('../models/score');


//index
async function index(req, res) {
    try {
      const scores = await Score.find();
      res.json(scores);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

//show
async function show(req, res) {
    try {
      const userId = req.params.userId 
      const score = await Score.findOne({userId : userId});
      res.json(score);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

//create 
async function create(req, res) {
    try {
      const { value, userId, subjectId } = req.body;
  
      const newScore = new Score({
        value,
        userId,
        subjectId
      });
  
      const savedScore = await newScore.save();
  
      res.status(201).json(savedScore);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}


//update

async function update(req, res) {
  try {
    const userId = req.params.userId; 
    const { value } = req.body;

    let score = await Score.findOne({userId: userId});

    if (!score) {
      return res.status(404).json({ error: 'this user doesnt have a score yet' });
    }

    score.value = value || score.value; 

    const updatedScore = await score.save();

    res.json(updatedScore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




module.exports = {
    index,
    show,
    create,
    update
  };