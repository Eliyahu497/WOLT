const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Define endpoint maps pointing directly to controller handlers
router.post('/', userController.loginAndGenerateToken);        // Maps to POST /api/tokens
module.exports = router;