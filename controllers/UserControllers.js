const User = require('../models').users
const Room = require('../models').rooms
const slug = require('slug')
const fs = require('fs')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const jwt = require('jsonwebtoken')

exports.CreateACCount = async (req, res) => {
    try {
        const { phone, password, username, confirm_password } = req.body
        if (!phone || !password || !confirm_password) return res.json({ status: 400, msg: 'Enter your phone number and password' })
        if (confirm_password !== password) return res.json({ status: 400, msg: 'password(s) mismatched' })
        const findPhone = await User.findOne({ where: { phone } })
        if (findPhone) return res.json({ status: 200, msg: 'Phone number already exists' })
        if (username) {
            const findusername = await User.findOne({ where: { username } })
            if (findusername) return res.json({ status: 200, msg: 'Username is taken' })
        }
        if (!req.files) return res.json({ status: 400, msg: 'image is required' })
        const imageData = req.files.image
        const filepath = './public/profiles'
        if (imageData.size >= 1000000) return res.json({ status: 400, msg: 'File too large' })

        if (!imageData.mimetype.startsWith('image/')) return res.json({ status: 400, msg: "Invalid Image format" })
        if (!fs.existsSync(filepath)) {
            fs.mkdirSync(filepath)
        }
        const imageName = `${slug(username ? username : phone, '_')}.webp`

        const user = await User.create({
            phone,
            password,
            username,
            image: imageName
        })
        await imageData.mv(`${filepath}/${imageName}`)

        return res.json({ status: 200, msg: 'Account created successfully', user })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.LoginAccount = async (req, res) => {
    try {
        const { phone, password } = req.body
        if (!phone || !password) return res.json({ status: 400, msg: "All fields are required" })
        const user = await User.findOne({ where: { phone } })
        if (!user) return res.json({ status: 400, msg: "Account not found" })
        if (password !== user.password) return res.json({ status: 400, msg: "Invalid Password" })
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1hr" })
        return res.json({ status: 200, msg: 'Logged in successfully', token })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.GetallUsers = async (req, res) => {
    try {
        // Check if the user ID is available in the request
        if (!req.user) {
            return res.json({ status: 400, msg: 'User ID not found in request' });
        }

        // Find all users except the user with the same ID as req.userId
        const users = await User.findAll({});
        const details = []
        users.map(ele => {
            if(ele.id !== req.user) {
                details.push(ele)
            }
            return ele
        })

        return res.json({ status: 200, users: details });
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}
exports.getUserProfile = async (req, res) => {
    try {
        const { id } = req.user
        const user = await User.findOne({ where: id })
        if (!user) return res.json({ status: 400, msg: "User not found" })
        return res.json({ status: 200, msg: user })
    } catch (error) {
        res.json({ status: 500, msg: error.message });
    }
}

exports.CreateRoom = async (req, res) => {
    try {
        const { reciever } = req.body
        if (!reciever) return res.json({ status: 404, msg: "Incomplete request found" })
        // check if a room exists with the sender and the reciever A - sender to E, E - sender to A
        let room;
        const getRoom = await Room.findOne({
            [Op.and]: [
                { sender: req.user, reciever },
                { sender: reciever, reciever: req.user }
            ]
        })
        if (!getRoom) {
            room = await Room.create({ sender: req.user, reciever })
        } else {
            room = getRoom
        }

        return res.json({ status: 200, msg: room.id })
    } catch (error) {
        res.json({ status: 500, msg: error.message });
    }
}

exports.GetRoomChats = async (req, res) => {
    try {
        const { roomid } = req.params
        if (!roomid) return res.json({ status: 404, msg: `provide a room ID` })
        const room = await Room.findOne({
            where: { id: roomid },
        })
        let friend;
        if(room.sender === req.user) {
            friend = room.reciever
        }else {
            friend = room.sender
        }
        const user = await User.findOne({ where: {id: friend} })

        const details = {
            ...room,
            friend: user
        }
        return res.json({status: 200, msg: details})
    } catch (error) {
        return res.json({ status: 500, msg: `${error}` });
    }
}
