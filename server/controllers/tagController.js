const Tag = require('./models/tags');

const TagController = {
  async retrieveTags(req, res) {
    const tags = await Tag.find();
    res.send(tags);
  },

  async updateTags(req, res) {
    const newData = req.body;
    const insertedTag = await Tag.create(newData);
    res.send(insertedTag); 
  },
};

module.exports = TagController;