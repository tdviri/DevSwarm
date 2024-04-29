const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagController');
const auth = require('../middleware/auth');

router.get('/api/retrievetags', TagController.retrieveTags)
router.post('/api/updatetags', auth, TagController.updateTags)

module.exports = router;