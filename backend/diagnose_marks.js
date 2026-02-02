const Mark = require('./models/Mark');
const User = require('./models/User');
const sequelize = require('./config/db');

async function diagnose() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const marks = await Mark.findAll({ limit: 20, order: [['createdAt', 'DESC']] });
        console.log('\n--- RECENT MARKS ---');
        if (marks.length === 0) console.log('No marks found in database.');
        marks.forEach(m => {
            console.log(`[ID: ${m.id}] Student: ${m.studentId} | Sub: ${m.subject} | Score: ${m.marks}/${m.maxScore} | Term: ${m.term} | Type: ${m.type} | Created: ${m.createdAt}`);
        });

        const students = await User.findAll({ where: { role: 'student' } });
        console.log('\n--- ALL STUDENTS ---');
        students.forEach(s => {
            console.log(`[ID: ${s.id}] Name: ${s.name} | Grade: "${s.grade}" | Reg: ${s.regNumber}`);
        });

        const marksCount = await Mark.count();
        console.log(`\nTotal Marks in DB: ${marksCount}`);
        console.log(`Total Students in DB: ${students.length}`);

    } catch (err) {
        console.error('Diagnosis failed:', err);
    } finally {
        await sequelize.close();
    }
}

diagnose();
