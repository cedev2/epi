const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Syllabus = sequelize.define('Syllabus', {
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    grade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Syllabus;
