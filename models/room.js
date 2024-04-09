module.exports = (sequelize, DataTypes) => {
    return sequelize.define('room', {
        sender: {type: DataTypes.INTEGER},
        reciever: {type: DataTypes.INTEGER},
    })
}