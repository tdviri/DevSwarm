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

  },

  async deleteTag(req, res){
    Tag.deleteOne({_id: ObjectId(req.body.tag._id)});
    res.send();
  }
}


module.exports = TagController;