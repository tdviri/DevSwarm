const Tag = require('../models/tags');
const Question = require('../models/questions');

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
    // const tag = await Tag.findById(req.body)
    // // await Question.findOneAndDelete({ _id: { $in: req.body.tags } }); //incorrect, just change it
    // await Tag.deleteOne(tag);
    // res.send();
  }
}


module.exports = TagController;