const User = require('./models/User');
const sequelize = require('./config/db');

async function checkAdmin() {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connected!');

        // Find all admin users
        const admins = await User.findAll({
            where: { role: 'admin' },
            attributes: ['id', 'name', 'email', 'role', 'createdAt']
        });

        console.log('\n=== ADMIN USERS IN DATABASE ===');
        if (admins.length === 0) {
            console.log('❌ NO ADMIN USERS FOUND!');
            console.log('\nCreating default admin...');

            const newAdmin = await User.create({
                name: 'System Admin',
                email: 'admin@epintwali.edu.rw',
                password: 'admin',
                role: 'admin'
            });

            console.log('✓ Admin created successfully!');
            console.log('Email: admin@epintwali.edu.rw');
            console.log('Password: admin');
        } else {
            console.log(`Found ${admins.length} admin user(s):\n`);
            admins.forEach((admin, index) => {
                console.log(`${index + 1}. ID: ${admin.id}`);
                console.log(`   Name: ${admin.name}`);
                console.log(`   Email: ${admin.email}`);
                console.log(`   Role: ${admin.role}`);
                console.log(`   Created: ${admin.createdAt}`);
                console.log('');
            });
        }

        // Test login credentials
        console.log('\n=== TESTING LOGIN ===');
        const testUser = await User.findOne({
            where: { email: 'admin@epintwali.edu.rw' }
        });

        if (testUser) {
            const isPasswordValid = await testUser.comparePassword('admin');
            console.log(`Email: admin@epintwali.edu.rw`);
            console.log(`Password 'admin' is valid: ${isPasswordValid ? '✓ YES' : '❌ NO'}`);

            if (!isPasswordValid) {
                console.log('\n⚠️  PASSWORD MISMATCH - Resetting password to "admin"...');
                testUser.password = 'admin';
                await testUser.save();
                console.log('✓ Password reset successfully!');
            }
        } else {
            console.log('❌ Admin user not found!');
        }

        await sequelize.close();
        console.log('\n✓ Check complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    }
}

checkAdmin();
