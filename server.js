require('dotenv').config()

const express = require('express')
const http = require('http')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const port = process.env.PORT 
const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors(
    {
        origin: ['http://localhost:5173','http://localhost:5174']
    }
))

app.use(fileUpload())
app.use(express.static('public'))
app.use('/api/user' ,require('./routes/userRoutes')) 
app.listen(port, ()=> console.log(`server running on http://localhost:${port}`))

