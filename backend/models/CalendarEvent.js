const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CalendarEvent = sequelize.define('CalendarEvent', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Exam', 'Holiday', 'Event', 'Other'),
        defaultValue: 'Event'
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = CalendarEvent;
