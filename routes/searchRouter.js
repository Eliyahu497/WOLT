const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/SearchController');

// GET /api/search/:query
router.get('/:query', SearchController.search);

module.exports = router;
