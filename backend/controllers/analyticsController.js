const User = require('../models/User');
const Mark = require('../models/Mark');
const { Op } = require('sequelize');

exports.getSystemStats = async (req, res) => {
    try {
        const studentCount = await User.count({ where: { role: 'student' } });
        const teacherCount = await User.count({ where: { role: 'teacher' } });
        const managerCount = await User.count({ where: { role: 'manager' } });

        // Calculate average performance (mock logic for now, using actual data)
        const allMarks = await Mark.findAll();
        const avgScore = allMarks.length > 0
            ? (allMarks.reduce((acc, m) => acc + m.marks, 0) / allMarks.length).toFixed(1)
            : 0;

        // Group students by grade
        const gradeDistribution = await User.findAll({
            attributes: ['grade', [require('sequelize').fn('COUNT', 'id'), 'count']],
            where: { role: 'student' },
            group: ['grade']
        });

        res.json({
            counts: {
                students: studentCount,
                teachers: teacherCount,
                managers: managerCount
            },
            performance: {
                averageScore: parseFloat(avgScore)
            },
            gradeDistribution
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
