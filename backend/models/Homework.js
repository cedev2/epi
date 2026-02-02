const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Homework = sequelize.define('Homework', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    grade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Homework;
