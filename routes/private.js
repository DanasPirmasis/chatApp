const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
	getPrivateData,
	getUsers,
	newConversation,
	getMessages,
	postMessage,
	getConversationRecipientUsernames,
} = require('../controllers/private');

router.route('/').get(protect, getPrivateData);
router.route('/searchusers').post(protect, getUsers);
router.route('/newconversation').post(protect, newConversation);
router.route('/getmessages').post( getMessages);
router.route('/postmessage').post( postMessage);
router.route('/getusernames').post(protect, getConversationRecipientUsernames);

module.exports = router;
