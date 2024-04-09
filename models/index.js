const {Sequelize, DataTypes} = require("sequelize")

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, '',{
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
})

sequelize.authenticate()
.then(()=> console.log('DB connected successfully'))
.catch(err=> console.log(err))


const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize


db.users =require("./userModel")(sequelize, DataTypes)
db.rooms = require("./room")(sequelize, DataTypes)
db.messages = require("./message")(sequelize, DataTypes)

db.sequelize.sync({force : false}).then(() => console.log("db tables synced successfully"))

db.users.hasMany(db.rooms, {foreignKey: 'reciever', as: 'friend'})


db.rooms.belongsTo(db.users, {foreignKey: 'reciever', as: 'friend'})

module.exports = db