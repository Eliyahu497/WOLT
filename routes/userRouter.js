const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Define endpoint maps pointing directly to controller handlers
router.post('/', userController.register);        // Maps to POST /api/users
router.get('/:id', userController.getProfile);     // Maps to GET /api/users/:id

module.exports = router;