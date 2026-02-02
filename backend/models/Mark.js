const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mark = sequelize.define('Mark', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marks: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    maxScore: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('CAT', 'Exam'),
        defaultValue: 'CAT'
    },
    term: {
        type: DataTypes.STRING,
        defaultValue: 'Term 1'
    },
    academicYear: {
        type: DataTypes.STRING,
        defaultValue: '2026'
    }
}, {
    // Add virtual field for percentage calculation
    getterMethods: {
        percentage() {
            if (this.maxScore && this.maxScore > 0) {
                return Math.round((this.marks / this.maxScore) * 100 * 100) / 100; // Round to 2 decimal places
            }
            return 0;
        }
    }
});

module.exports = Mark;
