const Subject = require('../models/subject');

//index

async function index(req, res) {
  try {
    const subjects = await Subject.find({});
    res.json({
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

    const newSubject = new Subject({
      name
    });

    const savedSubject = await newSubject.save();

    res.status(201).json(savedSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//delete

async function destroy(req, res) {
  try {
    const subjectId = req.params.id;

    const deletedSubject = await Subject.findByIdAndRemove(subjectId);

    if (!deletedSubject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(deletedSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  index,
  create,
  destroy
};
