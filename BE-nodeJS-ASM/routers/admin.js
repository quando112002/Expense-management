const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Các tuyến đường dành cho quản trị viên
router.get('/users', auth, auth.isAdmin, adminController.getAllUsers);
router.get('/user-expenses/:userId', auth, auth.isAdmin, adminController.getUserExpenses);
router.delete('/user/:userId', auth, auth.isAdmin, adminController.deleteUser);

module.exports = router;
