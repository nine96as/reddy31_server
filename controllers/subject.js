const Subject = require('../models/subject');
const Token = require('../models/token');
const User = require('../models/user');

//index

async function indexByUser(req, res) {
  try {
    const userToken = req.headers['authorization'];
    const token = await Token.findOne({ token: userToken });

    const user = await User.findOne({ _id: token.userId });

    const subjects = await Subject.find({ userId: user._id });
    res.status(200).json({
      count: subjects.length,
      data: subjects
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//create

async function create(req, res) {
  try {
    const { name } = req.body;
    const userToken = req.headers['authorization'];
    const token = await Token.findOne({ token: userToken });

    const subject = await Subject.create({
      name: name,
      userId: token.userId
    });

    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//delete

async function destroy(req, res) {
  try {
    const subjectId = req.params.id;

    const deletedSubject = await Subject.findByIdAndDelete(subjectId);

    if (!deletedSubject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.status(200).json(deletedSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  index,
  create,
  destroy
};
