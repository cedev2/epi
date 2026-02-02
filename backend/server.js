const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const User = require('./models/User');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/marks', require('./routes/markRoutes'));
app.use('/api/syllabus', require('./routes/syllabusRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/homework', require('./routes/homeworkRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully!');

        console.log('Syncing database...');
        await sequelize.sync({ alter: true });
        console.log('Database synced!');

        // Seed initial admin
        const adminExists = await User.findOne({ where: { role: 'admin' } });
        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: 'admin@epintwali.edu.rw',
                password: 'admin',
                role: 'admin'
            });
            console.log('Default admin created!');
        }

        app.listen(PORT, () => console.log(`API Server is up and running on port ${PORT}`));
    } catch (error) {
        console.error('FATAL ERROR DURING SERVER START:', error);
        process.exit(1); // Force exit with error code if it fails
    }
};

startServer();
