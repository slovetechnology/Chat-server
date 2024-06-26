const { CreateACCount, LoginAccount, GetallUsers, getUserProfile, CreateRoom, GetRoomChats, SendChatMessage } = require('../controllers/UserControllers');
const { UserMiddleware } = require('../middleware/auth');

const router = require('express').Router();

router.post('/create', CreateACCount)
router.post('/login', LoginAccount)
router.get('/allusers', UserMiddleware, GetallUsers)
router.get('/getuser', UserMiddleware, getUserProfile)

router.post('/create-room', UserMiddleware, CreateRoom)
router.get('/get-chat-room/:roomid', UserMiddleware, GetRoomChats)
router.post('/send-chat-message', UserMiddleware, SendChatMessage)

module.exports = router