const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testSyllabusVisibility() {
    try {
        console.log('=== SYLLABUS VISIBILITY DIAGNOSTIC ===\n');

        // 1. Login as Admin
        console.log('1. Logging in as Admin...');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            identifier: 'admin@epintwali.edu.rw',
            password: 'admin'
        });
        const adminToken = adminLogin.data.token;
        console.log('✓ Admin logged in\n');

        // 2. Check existing syllabi in database
        console.log('2. Checking all syllabi in database...');
        const allSyllabi = await axios.get(`${API_URL}/syllabus`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`Found ${allSyllabi.data.length} total syllabi:`);
        allSyllabi.data.forEach((s, i) => {
            console.log(`   ${i + 1}. Subject: ${s.subject}, Grade: ${s.grade}, File: ${s.fileUrl}`);
        });
        console.log('');

        // 3. Create a test student if needed
        console.log('3. Creating test student for Grade 5...');
        let studentEmail = `teststudent${Date.now()}@test.com`;
        let studentRegNumber = `26EPI${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

        try {
            await axios.post(`${API_URL}/users`, {
                name: 'Test Student',
                email: studentEmail,
                regNumber: studentRegNumber,
                password: studentRegNumber,
                role: 'student',
                grade: 'Grade 5'
            }, { headers: { Authorization: `Bearer ${adminToken}` } });
            console.log(`✓ Created student: ${studentRegNumber} (Grade 5)\n`);
        } catch (e) {
            console.log('Student creation failed (may already exist)\n');
        }

        // 4. Login as student
        console.log('4. Logging in as student...');
        const studentLogin = await axios.post(`${API_URL}/auth/login`, {
            identifier: studentRegNumber,
            password: studentRegNumber
        });
        const studentToken = studentLogin.data.token;
        const studentData = studentLogin.data;
        console.log(`✓ Student logged in: ${studentData.name}`);
        console.log(`   Grade: ${studentData.grade}`);
        console.log(`   Role: ${studentData.role}\n`);

        // 5. Fetch syllabi as student
        console.log('5. Fetching syllabi as student...');
        const studentSyllabi = await axios.get(`${API_URL}/syllabus`, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });

        console.log(`\n=== RESULT ===`);
        console.log(`Student Grade: ${studentData.grade}`);
        console.log(`Syllabi visible to student: ${studentSyllabi.data.length}`);

        if (studentSyllabi.data.length > 0) {
            console.log('\n✓ SUCCESS! Student can see syllabi:');
            studentSyllabi.data.forEach((s, i) => {
                console.log(`   ${i + 1}. ${s.subject} (${s.grade})`);
            });
        } else {
            console.log('\n❌ PROBLEM FOUND!');
            console.log(`Student in "${studentData.grade}" cannot see any syllabi.`);
            console.log('\nPossible causes:');
            console.log('   1. No syllabi uploaded for this grade');
            console.log('   2. Grade name mismatch (e.g., "Grade 5" vs "Grade5")');
            console.log('   3. Student has no grade assigned');

            // Check for grade mismatches
            const gradesInDb = [...new Set(allSyllabi.data.map(s => s.grade))];
            console.log(`\nGrades found in syllabi database: ${gradesInDb.join(', ')}`);
            console.log(`Student's grade: "${studentData.grade}"`);

            if (!gradesInDb.includes(studentData.grade)) {
                console.log('\n⚠️  GRADE MISMATCH DETECTED!');
                console.log('The student\'s grade does not match any syllabus grades.');
            }
        }

        // 6. Create a test syllabus for Grade 5 if none exists
        const grade5Syllabi = allSyllabi.data.filter(s => s.grade === 'Grade 5');
        if (grade5Syllabi.length === 0) {
            console.log('\n6. No syllabi for Grade 5 found. This is the issue!');
            console.log('   Teachers need to upload syllabi for Grade 5.');
        }

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testSyllabusVisibility();
