const express = require('express');
const router = express.Router();
const { getUsers, createUser, deleteUser, lookupUserByReg, updateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin', 'manager'), getUsers);
router.get('/lookup', lookupUserByReg);
router.post('/', authorize('admin'), createUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
