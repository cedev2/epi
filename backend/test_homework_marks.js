const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';

async function testHomeworkAndMarks() {
    try {
        console.log('=== TESTING HOMEWORK AND MARKS FUNCTIONALITY ===\n');

        // 1. Login as Teacher
        console.log('1. Logging in as Teacher...');
        const teacherLogin = await axios.post(`${API_URL}/auth/login`, {
            identifier: 'admin@epintwali.edu.rw',
            password: 'admin'
        });
        const teacherToken = teacherLogin.data.token;
        const teacherData = teacherLogin.data;
        console.log(`✓ Logged in as: ${teacherData.name} (${teacherData.role})`);
        console.log(`  Grade: ${teacherData.grade || 'N/A'}`);
        console.log(`  Subject: ${teacherData.subject || 'N/A'}\n`);

        // 2. Test Homework Assignment
        console.log('2. Testing Homework Assignment...');
        const testFile = path.join(__dirname, 'test.txt');
        fs.writeFileSync(testFile, 'Test homework content');

        const homeworkForm = new FormData();
        homeworkForm.append('title', 'Test Homework Assignment');
        homeworkForm.append('description', 'This is a test homework');
        homeworkForm.append('grade', 'Grade 2');
        homeworkForm.append('subject', 'Mathematics');
        homeworkForm.append('dueDate', '2026-12-31');
        homeworkForm.append('file', fs.createReadStream(testFile));

        try {
            const homeworkRes = await axios.post(`${API_URL}/homework`, homeworkForm, {
                headers: {
                    ...homeworkForm.getHeaders(),
                    Authorization: `Bearer ${teacherToken}`
                }
            });
            console.log('✓ Homework assigned successfully!');
            console.log(`  ID: ${homeworkRes.data.id}`);
            console.log(`  Title: ${homeworkRes.data.title}`);
            console.log(`  Subject: ${homeworkRes.data.subject}`);
            console.log(`  Grade: ${homeworkRes.data.grade}\n`);
        } catch (error) {
            console.log('❌ Homework assignment FAILED!');
            console.log(`  Status: ${error.response?.status}`);
            console.log(`  Error: ${error.response?.data?.message || error.message}`);
            console.log(`  Details:`, error.response?.data);
            console.log('');
        }

        // Cleanup test file
        fs.unlinkSync(testFile);

        // 3. Get a student to test marks
        console.log('3. Getting students...');
        const usersRes = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${teacherToken}` }
        });
        const students = usersRes.data.filter(u => u.role === 'student');

        if (students.length === 0) {
            console.log('⚠️  No students found in database\n');
        } else {
            const testStudent = students[0];
            console.log(`✓ Found student: ${testStudent.name} (${testStudent.regNumber})`);
            console.log(`  Grade: ${testStudent.grade}\n`);

            // 4. Test Marks Submission
            console.log('4. Testing Marks Submission...');
            try {
                const marksRes = await axios.post(`${API_URL}/marks/submit`, {
                    studentId: testStudent.id,
                    subject: 'Mathematics',
                    marks: 85,
                    type: 'CAT'
                }, {
                    headers: { Authorization: `Bearer ${teacherToken}` }
                });
                console.log('✓ Marks submitted successfully!');
                console.log(`  Student ID: ${marksRes.data.studentId}`);
                console.log(`  Subject: ${marksRes.data.subject}`);
                console.log(`  Marks: ${marksRes.data.marks}`);
                console.log(`  Type: ${marksRes.data.type}\n`);
            } catch (error) {
                console.log('❌ Marks submission FAILED!');
                console.log(`  Status: ${error.response?.status}`);
                console.log(`  Error: ${error.response?.data?.message || error.message}`);
                console.log(`  Details:`, error.response?.data);
                console.log('');
            }
        }

        // 5. Test fetching homework
        console.log('5. Fetching homework list...');
        try {
            const homeworkList = await axios.get(`${API_URL}/homework`, {
                headers: { Authorization: `Bearer ${teacherToken}` }
            });
            console.log(`✓ Found ${homeworkList.data.length} homework assignments`);
            if (homeworkList.data.length > 0) {
                console.log('  Recent homework:');
                homeworkList.data.slice(0, 3).forEach((hw, i) => {
                    console.log(`    ${i + 1}. ${hw.title} (${hw.subject} - ${hw.grade})`);
                });
            }
            console.log('');
        } catch (error) {
            console.log('❌ Failed to fetch homework');
            console.log(`  Error: ${error.message}\n`);
        }

        // 6. Test fetching marks
        console.log('6. Fetching marks...');
        try {
            const marksList = await axios.get(`${API_URL}/marks/student`, {
                headers: { Authorization: `Bearer ${teacherToken}` }
            });
            console.log(`✓ Found ${marksList.data.length} mark entries`);
            if (marksList.data.length > 0) {
                console.log('  Recent marks:');
                marksList.data.slice(0, 5).forEach((m, i) => {
                    console.log(`    ${i + 1}. Student ${m.studentId}: ${m.subject} ${m.type} = ${m.marks}`);
                });
            }
            console.log('');
        } catch (error) {
            console.log('❌ Failed to fetch marks');
            console.log(`  Error: ${error.message}\n`);
        }

        console.log('=== DIAGNOSTIC COMPLETE ===');

    } catch (error) {
        console.error('\n❌ CRITICAL ERROR:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testHomeworkAndMarks();
