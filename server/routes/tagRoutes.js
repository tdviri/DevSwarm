const express = require('express');
const router = express.Router();
const TagController = require('./controllers/tagController');
const auth = require('./auth');

router.get('/retrievetags', auth.verify, TagController.retrieveTags)
router.put('/updatetags', auth.verify, TagController.updateTags)

module.exports = router;