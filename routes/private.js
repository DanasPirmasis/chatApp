const express = require('express');
const router = express.Router();
const { getPrivateData } = require('../controllers/private');
const { protect } = require('../middleware/auth');
const { getUsers } = require('../controllers/private');

router.route('/').get(protect, getPrivateData);
router.route('/searchusers').post(getUsers);

module.exports = router;
