const Mark = require('../models/Mark');
const User = require('../models/User');

exports.submitMarks = async (req, res) => {
    try {
        const { studentId, subject, marks, maxScore, type, term, academicYear } = req.body;
        const teacherId = req.user.id;

        let mark = await Mark.findOne({
            where: {
                studentId,
                subject,
                type: type || 'CAT',
                term: term || 'Term 1',
                academicYear: academicYear || '2026'
            }
        });

        if (mark) {
            // Accumulate marks and maxScore
            mark.marks = (mark.marks || 0) + parseFloat(marks);
            mark.maxScore = (mark.maxScore || 0) + (parseFloat(maxScore) || 100);
            mark.teacherId = teacherId;
            await mark.save();
        } else {
            mark = await Mark.create({
                studentId,
                teacherId,
                subject,
                marks: parseFloat(marks),
                maxScore: parseFloat(maxScore) || 100,
                type: type || 'CAT',
                term: term || 'Term 1',
                academicYear: academicYear || '2026'
            });
        }

        res.json(mark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentMarks = async (req, res) => {
    try {
        const { grade, subject, studentId } = req.query; // Changed from params to query for flexibility
        let whereClause = {};
        let includeClause = [];

        // If specific student ID provided
        if (studentId) {
            whereClause.studentId = studentId;
        }

        // If subject provided
        if (subject) {
            whereClause.subject = subject;
        }

        // Include Student info to filter by grade
        includeClause.push({
            model: User,
            as: 'student', // Ensure association is defined in DB config or models
            attributes: ['id', 'name', 'grade', 'regNumber'],
            where: grade ? { grade } : {}
        });

        // Role based access
        if (req.user.role === 'student') {
            // Students only see their own
            whereClause.studentId = req.user.id;
        }

        const marks = await Mark.findAll({
            where: whereClause,
            // We need to make sure the association exists. 
            // Since we might not have defined 'as: student' yet, let's check User model or association setup.
            // Assuming standard association for now, but will need to verify later.
            // Actually, we can just do a raw subquery or join if association isn't set up, but let's assume association.
            // Use 'include' might fail if not set up in models/index.js or similar.
            // Let's check if User has association. 
        });

        // To safely filter by grade without explicit association setup in this file (if not global):
        // We can fetch students of that grade first, then fetch marks for those studentIds.
        // This is safer if associations aren't guaranteed.

        let targetStudentIds = [];
        if (grade) {
            const studentsInGrade = await User.findAll({ where: { grade, role: 'student' }, attributes: ['id'] });
            targetStudentIds = studentsInGrade.map(s => s.id);
            if (targetStudentIds.length === 0) return res.json([]); // No students in that grade

            if (whereClause.studentId) {
                // If specific student requested, check if they are in the grade
                if (!targetStudentIds.includes(parseInt(whereClause.studentId))) {
                    return res.json([]);
                }
            } else {
                whereClause.studentId = targetStudentIds;
            }
        }

        const finalMarks = await Mark.findAll({ where: whereClause });
        res.json(finalMarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getClassRankings = async (req, res) => {
    try {
        const { grade, term, academicYear } = req.query;
        if (!grade) return res.status(400).json({ message: "Grade is required" });

        // Fetch all students in that grade
        const students = await User.findAll({
            where: { grade, role: 'student' },
            attributes: ['id', 'name']
        });

        // Fetch marks for that grade and year
        const studentIds = students.map(s => s.id);
        const whereClause = {
            studentId: studentIds,
            academicYear: academicYear || '2026'
        };
        if (term) whereClause.term = term;

        const marks = await Mark.findAll({ where: whereClause });

        // Group by student and calculate average percentage
        const rankings = students.map(student => {
            const studentMarks = marks.filter(m => m.studentId === student.id);
            if (studentMarks.length === 0) return { studentId: student.id, name: student.name, average: 0 };

            // For term rankings, we calculate average of marks in that term
            // For annual (no term), we calculate overall average across all marks
            const totalPercentage = studentMarks.reduce((acc, m) => {
                const perc = (m.marks / (m.maxScore || 100)) * 100;
                return acc + perc;
            }, 0);

            const average = totalPercentage / studentMarks.length;

            return {
                studentId: student.id,
                name: student.name,
                average: Math.round(average * 100) / 100,
                subjectsCount: studentMarks.length
            };
        });

        // Sort by average descending
        rankings.sort((a, b) => b.average - a.average);

        // Add rank number
        rankings.forEach((r, index) => {
            r.rank = index + 1;
        });

        res.json({
            term: term || 'Annual',
            totalStudents: students.length,
            rankings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
