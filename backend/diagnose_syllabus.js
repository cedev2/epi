const Syllabus = require('./models/Syllabus');
const User = require('./models/User');
const sequelize = require('./config/db');

async function diagnoseSyllabus() {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connected!\n');

        // Get all syllabi
        const allSyllabi = await Syllabus.findAll();
        console.log('=== ALL SYLLABI IN DATABASE ===');
        if (allSyllabi.length === 0) {
            console.log('❌ NO SYLLABI FOUND IN DATABASE!');
            console.log('This is the problem - teachers need to upload syllabi first.\n');
        } else {
            console.log(`Found ${allSyllabi.length} syllabi:\n`);
            allSyllabi.forEach((s, i) => {
                console.log(`${i + 1}. Subject: ${s.subject}`);
                console.log(`   Grade: "${s.grade}"`);
                console.log(`   File: ${s.fileUrl}`);
                console.log(`   Teacher ID: ${s.teacherId}`);
                console.log(`   Created: ${s.createdAt}\n`);
            });
        }

        // Get unique grades from syllabi
        const syllabusGrades = [...new Set(allSyllabi.map(s => s.grade))];
        console.log('=== GRADES IN SYLLABI ===');
        console.log(syllabusGrades.length > 0 ? syllabusGrades.join(', ') : 'None');
        console.log('');

        // Get all students
        const students = await User.findAll({
            where: { role: 'student' },
            attributes: ['id', 'name', 'grade', 'regNumber']
        });

        console.log('=== STUDENTS IN DATABASE ===');
        if (students.length === 0) {
            console.log('No students found.\n');
        } else {
            console.log(`Found ${students.length} students:\n`);
            students.forEach((s, i) => {
                console.log(`${i + 1}. ${s.name} (${s.regNumber})`);
                console.log(`   Grade: "${s.grade}"`);

                // Check if student's grade has syllabi
                const matchingSyllabi = allSyllabi.filter(syl => syl.grade === s.grade);
                console.log(`   Syllabi available: ${matchingSyllabi.length}`);
                if (matchingSyllabi.length > 0) {
                    matchingSyllabi.forEach(syl => {
                        console.log(`      - ${syl.subject}`);
                    });
                }
                console.log('');
            });
        }

        // Get unique student grades
        const studentGrades = [...new Set(students.map(s => s.grade).filter(g => g))];
        console.log('=== GRADES ASSIGNED TO STUDENTS ===');
        console.log(studentGrades.length > 0 ? studentGrades.join(', ') : 'None');
        console.log('');

        // Check for mismatches
        console.log('=== DIAGNOSIS ===');
        if (allSyllabi.length === 0) {
            console.log('❌ PROBLEM: No syllabi uploaded yet!');
            console.log('   SOLUTION: Teachers need to upload syllabi files.');
        } else if (students.length === 0) {
            console.log('⚠️  No students in database to test with.');
        } else {
            // Check for grade mismatches
            const mismatches = [];
            studentGrades.forEach(grade => {
                if (!syllabusGrades.includes(grade)) {
                    mismatches.push(grade);
                }
            });

            if (mismatches.length > 0) {
                console.log('❌ GRADE MISMATCH DETECTED!');
                console.log(`   Students in these grades have NO syllabi:`);
                mismatches.forEach(g => console.log(`      - "${g}"`));
                console.log('\n   SOLUTION: Upload syllabi for these grades OR fix grade naming.');
            } else {
                console.log('✓ All student grades have matching syllabi!');
                console.log('   The system should be working correctly.');
                console.log('\n   If students still can\'t see syllabi, check:');
                console.log('   1. Are they logged in correctly?');
                console.log('   2. Is the frontend making the API call?');
                console.log('   3. Check browser console for errors.');
            }
        }

        await sequelize.close();

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

diagnoseSyllabus();
