const Homework = require('../models/Homework');

exports.createHomework = async (req, res) => {
    try {
        console.log('Create Homework Payload:', req.body);
        console.log('User:', req.user.id);

        const { title, description, grade, subject, dueDate } = req.body;
        const teacherId = req.user.id;

        // Add file url if uploaded
        let fileUrl = null;
        if (req.file) {
            fileUrl = `/uploads/homework/${req.file.filename}`;
        }

        const homework = await Homework.create({
            title,
            description,
            grade,
            subject,
            dueDate,
            fileUrl,
            teacherId
        });

        res.status(201).json(homework);
    } catch (error) {
        console.error('Homework Creation Error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getHomework = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'student') {
            if (!req.user.grade) {
                // If student has no grade assigned, return empty or error?
                // Let's return empty for safe fail
                return res.json([]);
            }
            query = { grade: req.user.grade };
        } else if (req.user.role === 'teacher') {
            // Teachers can see what they created, or filter by grade/subject
            // Let's allow filtering
            const { grade, subject } = req.query;
            if (grade) query.grade = grade;
            if (subject) query.subject = subject;
            // Optional: limit to teacherId? query.teacherId = req.user.id;
            // But maybe they want to see other teachers' homework for the same class?
            // Let's stick to showing all for the grade/subject for now, or just their own.
            // Requirement says "Teacher... Sending work". It doesn't explicitly say they manage ONLY their own work but implies it.
            // Let's default to all for flexibility unless filtered.
        }

        const homeworks = await Homework.findAll({
            where: query,
            order: [['createdAt', 'DESC']]
        });
        res.json(homeworks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteHomework = async (req, res) => {
    try {
        const homework = await Homework.findByPk(req.params.id);
        if (!homework) return res.status(404).json({ message: 'Homework not found' });

        if (req.user.role !== 'admin' && homework.teacherId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await homework.destroy();
        res.json({ message: 'Homework deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
