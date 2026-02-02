const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, regNumber, password, role, grade, subject } = req.body;
        const orConditions = [];
        if (email) orConditions.push({ email });
        if (regNumber) orConditions.push({ regNumber });

        const userExists = orConditions.length > 0
            ? await User.findOne({ where: { [require('sequelize').Op.or]: orConditions } })
            : null;

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email: email || null,
            regNumber: regNumber || null,
            password,
            role,
            grade: grade || null,
            subject: subject || null
        });
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            grade: user.grade,
            subject: user.subject
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.lookupUserByReg = async (req, res) => {
    try {
        const { regNumber } = req.query;
        const user = await User.findOne({
            where: { regNumber, role: 'student' },
            attributes: ['id', 'name', 'regNumber', 'grade']
        });
        if (!user) return res.status(404).json({ message: 'Student not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, regNumber, password, role, grade, subject } = req.body;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.regNumber = regNumber || user.regNumber;
        user.role = role || user.role;
        user.grade = grade || user.grade;
        user.subject = subject || user.subject;

        if (password) {
            user.password = password;
        }

        await user.save();

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            regNumber: user.regNumber,
            role: user.role,
            grade: user.grade,
            subject: user.subject
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
