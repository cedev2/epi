const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';

async function runTest() {
    try {
        // 1. Login as Admin to ensure we can create a teacher if needed
        console.log('Logging in as Admin...');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            identifier: 'admin@epintwali.edu.rw',
            password: 'admin'
        });
        const adminToken = adminLogin.data.token;
        console.log('Admin logged in.');

        // 2. Create/Get Teacher
        // We'll just create a fresh one to be sure
        const teacherEmail = `testteacher${Date.now()}@test.com`;
        console.log(`Creating teacher: ${teacherEmail}`);

        try {
            await axios.post(`${API_URL}/users`, {
                name: 'Test Teacher',
                email: teacherEmail,
                password: 'password123',
                role: 'teacher',
                subject: 'Mathematics',
                grade: 'Grade 5'
            }, { headers: { Authorization: `Bearer ${adminToken}` } });
        } catch (e) {
            // Check if user already exists
            if (e.response && e.response.status === 400) {
                console.log('User might already exist, proceeding...');
            } else {
                throw e;
            }
        }

        // 3. Login as Teacher
        console.log('Logging in as Teacher...');
        const teacherLogin = await axios.post(`${API_URL}/auth/login`, {
            identifier: teacherEmail,
            password: 'password123'
        });
        const teacherToken = teacherLogin.data.token;
        const teacherId = teacherLogin.data.id;
        console.log(`Teacher logged in. Token: ${teacherToken.substring(0, 20)}...`);

        // 4. Create dummy file
        const filePath = path.join(__dirname, 'test.txt');
        fs.writeFileSync(filePath, 'This is a test homework file content.');

        // 5. Upload Homework
        console.log('Uploading Homework...');
        const form = new FormData();
        form.append('title', 'Test Homework Script');
        form.append('description', 'Created via debug script');
        form.append('grade', 'Grade 5');
        form.append('subject', 'Mathematics');
        form.append('dueDate', '2026-12-31');
        form.append('file', fs.createReadStream(filePath));

        const response = await axios.post(`${API_URL}/homework`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${teacherToken}`
            }
        });

        console.log('SUCCESS! Homework created:', response.data);

        // Cleanup
        fs.unlinkSync(filePath);

    } catch (error) {
        console.error('FAILED!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

runTest();
