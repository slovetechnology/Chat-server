require('dotenv').config()

const {Server} = require('socket.io')

const express = require('express')
const http = require('http')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const port = process.env.PORT 
const app = express()
const server = http.createServer(app)


const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173','http://localhost:5174', 'https://wassupchat.netlify.app']
    }
})

io.on('connection', (socket) => {
    // console.log(`connected to client ${socket.id}`)
    socket.on('sending-chat-message', () => {
        socket.broadcast.emit('send-back-chat')
    })

    socket.on('user-is-typing', () => {
        socket.broadcast.emit('user-is-typing')
    })
    socket.on('user-is-not-typing', () => {
        socket.broadcast.emit('user-is-not-typing')
    })
})

app.use(express.json())
app.use(cors(
    {
        origin: ['http://localhost:5173','http://localhost:5174', 'https://wassupchat.netlify.app']
    }
))

// ftp password = wassupchat.netlify.app

app.use(fileUpload())
app.use(express.static('public'))
app.use('/api/user' ,require('./routes/userRoutes')) 
server.listen(port, ()=> console.log(`server running on http://localhost:${port}`))

