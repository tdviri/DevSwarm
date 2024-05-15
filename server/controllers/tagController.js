const Tag = require('../models/tags');
const Question = require('../models/questions');
const User = require('../models/users');

const TagController = {
  async retrieveTags(req, res) {
    const tags = await Tag.find();
    res.send(tags);
  },

  async updateTags(req, res) {
    const user = await User.findById(req.userId);
    const newData = req.body;
    const insertedTag = await Tag.create(newData);
    user.tagsCreated.push(insertedTag);
    user.save();
    res.send(insertedTag); 
  },

  async editTag(req, res){
    const tag = await Tag.findById(req.body.id);
    tag.name = req.body.name;
    tag.save();
    res.send();
  },

  async deleteTag(req, res){
    //delete tag from question it belongs to (only if they are unique)
    //delete tag from tagsCreated in user document
    //delete tag document itself

    const tagId = req.body.tagId; 
    await Question.updateMany(
        { tags: tagId },
        { $pull: { tags: tagId } } 
    );
    await User.findOneAndUpdate(
      { tagsCreated: tagId },
      { $pull: { tagsCreated: tagId } }, 
      { new: true } 
    )
    await Tag.deleteOne({ _id: tagId });
    res.send();
  }
}


module.exports = TagController;