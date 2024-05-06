const Tag = require('../models/tags');

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

  async editTag(req, res){
    const tag = await Tag.findById(req.body.id);
    tag.name = req.body.name;
    tag.save();
    res.send();
  },

  async deleteTag(req, res){
    await Tag.deleteOne(req.body.tag);
    res.send();
  }
}


module.exports = TagController;