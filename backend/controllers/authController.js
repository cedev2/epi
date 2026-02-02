const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.login = async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [
                    { email: identifier },
                    { regNumber: identifier }
                ]
            }
        });

        if (user && (await user.comparePassword(password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                regNumber: user.regNumber,
                role: user.role,
                grade: user.grade,
                subject: user.subject,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
