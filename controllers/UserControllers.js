const User = require('../models').users
const slug = require('slug')
const fs = require('fs')
const Sequelize = require('sequelize');

const jwt = require('jsonwebtoken')

exports.CreateACCount = async (req, res) => {
    try {
        const { phone, password, username , confirm_password} = req.body
        if (!phone || !password || !confirm_password) return res.json({ status: 400, msg: 'Enter your phone number and password' })
    if(confirm_password !== password) return res.json({ status: 400, msg:'password(s) mismatched' })
        const findPhone = await User.findOne({ where: { phone } })
        if (findPhone) return res.json({ status: 200, msg: 'Phone number already exists' })
     if(username){
        const findusername = await User.findOne({ where: { username } })
         if (findusername) return res.json({ status: 200, msg: 'Username is taken'})
     }
        if (!req.files) return res.json({ status: 400, msg: 'image is required' })
        const imageData = req.files.image
        const filepath = './public/profiles'
        if(imageData.size >= 1000000) return res.json({ status: 400, msg:'File too large' })

        if(!imageData.mimetype.startsWith('image/')) return res.json({ status: 400, msg: "Invalid Image format"})
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

exports.LoginAccount = async (req,res) => {
    try {
        const {phone, password} = req.body
        if(!phone || !password)  return res.json({ status: 400, msg: "All fields are required"})
        const user = await User.findOne({ where: { phone } })
        if (!user) return res.json({status: 400, msg: "Account not found"})
        if(password !== user.password) return res.json({status: 400, msg:"Invalid Password"})
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1hr" })
        return res.json({status: 200,msg:'Logged in successfully', token})
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
        const users = await User.findAll({
            where: {
                id: {
                    [Sequelize.Op.not]: req.user // Exclude the user's own ID
                }
            }
        });

        return res.json({ status: 200, users: users });
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}
exports.getUserProfile = async(req,res) =>{
    try {
        const {id} = req.user
        const user = await User.findOne({where : id})
        if(!user) return res.json({status: 400, msg: "User not found"})
        return res.json({status: 200,msg: user})
    } catch (error) {
        res.json({ status: 500, msg: error.message });
    }
}
