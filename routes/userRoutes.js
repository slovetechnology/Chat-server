const { CreateACCount, LoginAccount, GetallUsers, getUserProfile } = require('../controllers/UserControllers');
const { UserMiddleware } = require('../middleware/auth');

const router = require('express').Router();

router.post('/create', CreateACCount)
router.post('/login', LoginAccount)
router.get('/allusers', UserMiddleware, GetallUsers)
router.get('/getuser', UserMiddleware, getUserProfile)

module.exports = router