const jwt = require('jsonwebtoken');
const User = require('../models').users

exports.UserMiddleware = async (req, res, next) => {
    try {
        const tokenHeader = req.headers.authorization
        console.log(tokenHeader)
        if (!tokenHeader) return res.json({ status: 400, msg: 'Forbidden' })
        const token = tokenHeader.split(' ')[1]
        console.log(token)
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        console.log(verified)
        if (!verified) return res.json({ status: 400, msg: 'Unauthorized' })
        const FindeUser = await User.findOne({ where: { id: verified.id } })
        console.log(FindeUser)
        if (!FindeUser) return res.json({ status: 400, msg: 'Invalid Account' })
        req.user = FindeUser.id
        next()
    } catch (error) {
        return res.json({ status: 500, msg: `error from middleware ${error.message}` })
    }
}