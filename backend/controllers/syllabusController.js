const Syllabus = require('../models/Syllabus');
const User = require('../models/User');

exports.uploadSyllabus = async (req, res) => {
    try {
        const { subject, grade } = req.body;
        const teacherId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/syllabi/${req.file.filename}`;

        const syllabus = await Syllabus.create({
            subject,
            grade,
            fileUrl,
            teacherId
        });

        res.status(201).json(syllabus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSyllabi = async (req, res) => {
    try {
        let query = {};

        // Students only get syllabi for their grade
        if (req.user.role === 'student') {
            if (!req.user.grade) {
                return res.json([]); // No grade assigned, no syllabi
            }
            query = { grade: req.user.grade };
        }
        // Teachers get syllabi they uploaded or for their subject/grade
        else if (req.user.role === 'teacher') {
            // Option: Teachers see all, or just theirs? Let's show all for now but filterable
            const { grade, subject } = req.query;
            if (grade) query.grade = grade;
            if (subject) query.subject = subject;
        }

        const syllabi = await Syllabus.findAll({ where: query });
        res.json(syllabi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteSyllabus = async (req, res) => {
    try {
        const syllabus = await Syllabus.findByPk(req.params.id);
        if (!syllabus) return res.status(404).json({ message: 'Syllabus not found' });

        // Only the teacher who uploaded or admin can delete
        if (req.user.role !== 'admin' && syllabus.teacherId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this syllabus' });
        }

        await syllabus.destroy();
        res.json({ message: 'Syllabus deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
