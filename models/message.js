module.exports = (sequelize, DataTypes) => {
    return sequelize.define('message', {
        roomid: {type: DataTypes.INTEGER},
        content: {type: DataTypes.TEXT},
        media: {type: DataTypes.STRING, allowNull: true},
        status: {type: DataTypes.STRING, allowNull: true},
        sender: {type: DataTypes.INTEGER},
    })
}