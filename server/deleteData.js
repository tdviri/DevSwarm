const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fake_so', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Question = require('./models/questions');
const Answer = require('./models/answers');
const Tag = require('./models/tags');
const User = require('./models/users');

async function deleteAllDocuments(model) {
    await model.deleteMany({});
}

async function deleteAllData() {
  await deleteAllDocuments(Question);
  await deleteAllDocuments(Answer);
  await deleteAllDocuments(Tag);
  await deleteAllDocuments(User);

  mongoose.disconnect();
}

deleteAllData();