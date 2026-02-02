import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import api from '../utils/api';
import {
    Users,
    BarChart,
    LogOut,
    GraduationCap,
    Briefcase,
    User,
    CheckCircle,
    Layout,
    TrendingUp
} from 'lucide-react';

const SchoolManagerDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ teachers: 0, students: 0 });
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [performanceData, setPerformanceData] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student', grade: '', subject: '', regNumber: '', password: '' });
    const [isEditing, setIsEditing] = useState(null);

    const fetchData = async () => {
        try {
            const [usersRes, marksRes] = await Promise.all([
                api.get('/users'),
                api.get('/marks/student') // This returns all marks for manager context
            ]);
            const allUsers = usersRes.data;
            setUsers(allUsers);
            setStats({
                teachers: allUsers.filter(u => u.role === 'teacher').length,
                students: allUsers.filter(u => u.role === 'student').length
            });

            // Calculate performance per grade
            const gradePerformance = {};
            const gradeCounts = {};

            // Helper to get grade of student
            const getStudentGrade = (id) => allUsers.find(u => u.id === id)?.grade;

            marksRes.data.forEach(m => {
                const grade = getStudentGrade(m.studentId);
                if (grade) {
                    if (!gradePerformance[grade]) {
                        gradePerformance[grade] = 0;
                        gradeCounts[grade] = 0;
                    }
                    gradePerformance[grade] += m.marks;
                    gradeCounts[grade]++;
                }
            });

            const chartData = Object.keys(gradePerformance).map(grade => ({
                grade,
                average: (gradePerformance[grade] / gradeCounts[grade]).toFixed(1)
            }));
            setPerformanceData(chartData);

        } catch (error) {
            console.error('Error fetching manager data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/users/${isEditing}`, newUser);
                alert('User updated successfully');
            } else {
                await api.post('/users', newUser); // matched with router.post('/', ...)
                alert('User created successfully');
            }
            setNewUser({ name: '', email: '', role: 'student', grade: '', subject: '', regNumber: '', password: '' });
            setIsEditing(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving user');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting user');
            }
        }
    };

    const startEdit = (user) => {
        setNewUser({
            name: user.name,
            email: user.email || '',
            role: user.role,
            grade: user.grade || '',
            subject: user.subject || '',
            regNumber: user.regNumber || '',
            password: '' // Don't fill password
        });
        setIsEditing(user.id);
        // Switch tab to appropriate role to show form if needed, or just open modal. 
        // For simplicity, we assume the form is visible in the active tab.
    };

    return (
        <div className="dashboard-layout">
            <aside className="dash-sidebar dark">
                <div className="sidebar-header pt-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm border border-slate-100 p-1">
                            <img src="/teacher icon.png" alt="Manager" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-wider">Welcome</p>
                            <h2 className="text-sm font-bold text-white leading-tight">{user?.name}</h2>
                        </div>
                    </div>
                </div>

                <div className="sidebar-profile">
                    <div className="profile-img-mini overflow-hidden">
                        <img src="/teacher icon.png" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-xs opacity-70 italic font-bold">Manager</p>
                        <p className="text-sm font-bold leading-tight text-white">{user?.email}</p>
                    </div>
                </div>

                <nav className="sidebar-nav mt-4">
                    <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                        <BarChart className="w-5 h-5 mr-3 inline" /> Overview
                    </button>
                    <button className={activeTab === 'teachers' ? 'active' : ''} onClick={() => { setActiveTab('teachers'); setNewUser(prev => ({ ...prev, role: 'teacher' })); setIsEditing(null); }}>
                        <Users className="w-5 h-5 mr-3 inline" /> Teachers
                    </button>
                    <button className={activeTab === 'students' ? 'active' : ''} onClick={() => { setActiveTab('students'); setNewUser(prev => ({ ...prev, role: 'student' })); setIsEditing(null); }}>
                        <GraduationCap className="w-5 h-5 mr-3 inline" /> Students
                    </button>
                    <button className={activeTab === 'performance' ? 'active' : ''} onClick={() => setActiveTab('performance')}>
                        <TrendingUp className="w-5 h-5 mr-3 inline" /> Performance
                    </button>
                    <button className="logout-btn" onClick={logout}>
                        <LogOut className="w-5 h-5 mr-3 inline" /> Logout
                    </button>
                </nav>
            </aside>

            <main className="dash-main">
                <header className="student-banner">
                    <div className="student-info-box">
                        <div className="student-avatar" style={{ background: '#0ea5e9', color: 'white' }}>
                            <Briefcase className="w-10 h-10" />
                        </div>
                        <div className="student-details">
                            <div className="flex items-center gap-3">
                                <h2>School Audit Console</h2>
                                <span className="status-badge" style={{ background: '#0ea5e9' }}>MANAGEMENT</span>
                            </div>
                            <p className="text-sm">Logged in as: {user?.name} • Session: 2026 Academic Year</p>
                        </div>
                    </div>
                </header>

                <div className="dash-content">
                    {activeTab === 'overview' && (
                        <>
                            <div className="summary-grid">
                                <div className="summary-card blue">
                                    <div className="info">
                                        <div className="number">{stats.teachers}</div>
                                        <div className="label">Total Teachers</div>
                                    </div>
                                    <Users className="icon-overlay" />
                                    <button onClick={() => setActiveTab('teachers')} className="more-info w-full text-left">View Staff List →</button>
                                </div>
                                <div className="summary-card red">
                                    <div className="info">
                                        <div className="number">{stats.students}</div>
                                        <div className="label">Total Students</div>
                                    </div>
                                    <GraduationCap className="icon-overlay" />
                                    <button onClick={() => setActiveTab('students')} className="more-info w-full text-left">View Enrollment →</button>
                                </div>
                                <div className="summary-card gray">
                                    <div className="info">
                                        <div className="number">{performanceData.length}</div>
                                        <div className="label">Active Grades</div>
                                    </div>
                                    <Layout className="icon-overlay" />
                                    <button onClick={() => setActiveTab('performance')} className="more-info w-full text-left">View Performance →</button>
                                </div>
                            </div>

                            <div className="dash-card">
                                <h3 className="text-xl font-bold mb-6">Recent Staff Activity</h3>
                                <div className="overflow-x-auto">
                                    <table className="dash-table">
                                        <thead>
                                            <tr>
                                                <th>Staff Name</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                                <th>Performance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.filter(u => u.role === 'teacher').slice(0, 5).map(t => (
                                                <tr key={t.id}>
                                                    <td className="font-bold">{t.name}</td>
                                                    <td className="text-slate-500">{t.email}</td>
                                                    <td><span className="badge pass">ACTIVE</span></td>
                                                    <td className="text-xs font-bold text-blue-600">PROFICIENT</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {(activeTab === 'teachers' || activeTab === 'students') && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="dash-card lg:col-span-1">
                                <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit' : 'Add New'} {activeTab === 'teachers' ? 'Teacher' : 'Student'}</h3>
                                <form onSubmit={handleCreateUser} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded-lg text-sm"
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    {activeTab === 'teachers' ? (
                                        <>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    className="w-full p-2 border rounded-lg text-sm"
                                                    value={newUser.email}
                                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                                                <select
                                                    className="w-full p-2 border rounded-lg text-sm"
                                                    value={newUser.subject}
                                                    onChange={(e) => setNewUser({ ...newUser, subject: e.target.value })}
                                                    required={activeTab === 'teachers'}
                                                >
                                                    <option value="">Select Subject</option>
                                                    {['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Assigned Grade</label>
                                                <select
                                                    className="w-full p-2 border rounded-lg text-sm"
                                                    value={newUser.grade}
                                                    onChange={(e) => setNewUser({ ...newUser, grade: e.target.value })}
                                                    required={activeTab === 'teachers'}
                                                >
                                                    <option value="">Select Grade</option>
                                                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map(g => (
                                                        <option key={g} value={g}>{g}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Reg Number</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border rounded-lg text-sm"
                                                    value={newUser.regNumber}
                                                    onChange={(e) => setNewUser({ ...newUser, regNumber: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Grade</label>
                                                <select
                                                    className="w-full p-2 border rounded-lg text-sm"
                                                    value={newUser.grade}
                                                    onChange={(e) => setNewUser({ ...newUser, grade: e.target.value })}
                                                    required={activeTab === 'students'}
                                                >
                                                    <option value="">Select Grade</option>
                                                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map(g => (
                                                        <option key={g} value={g}>{g}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Password {isEditing && '(Leave blank to keep current)'}</label>
                                        <input
                                            type="password"
                                            className="w-full p-2 border rounded-lg text-sm"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            required={!isEditing}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="flex-1 py-2 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-all">
                                            {isEditing ? 'Update User' : 'Create User'}
                                        </button>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => { setIsEditing(null); setNewUser({ name: '', email: '', role: activeTab === 'teachers' ? 'teacher' : 'student', grade: '', subject: '', regNumber: '', password: '' }); }}
                                                className="px-4 py-2 bg-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-300"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="dash-card lg:col-span-2">
                                <h3 className="text-xl font-bold mb-6">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Directory</h3>
                                <div className="overflow-x-auto">
                                    <table className="dash-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Identifier</th>
                                                <th>Info</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.filter(u => u.role === (activeTab === 'teachers' ? 'teacher' : 'student')).map(u => (
                                                <tr key={u.id}>
                                                    <td className="font-bold">{u.name}</td>
                                                    <td className="font-mono text-sm">{u.role === 'student' ? u.regNumber : u.email}</td>
                                                    <td className="text-xs">
                                                        {u.role === 'teacher' ? `${u.subject} (${u.grade})` : u.grade}
                                                    </td>
                                                    <td>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => startEdit(u)} className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
                                                            <button onClick={() => handleDeleteUser(u.id)} className="text-xs font-bold text-red-600 hover:underline">Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'performance' && (
                        <div className="dash-card">
                            <h3 className="text-xl font-bold mb-6">Class Performance Analytics</h3>
                            <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4 bg-slate-50 rounded-xl border border-slate-100">
                                {performanceData.length > 0 ? performanceData.map((data, index) => (
                                    <div key={index} className="flex flex-col items-center w-full group">
                                        <div
                                            className="w-full max-w-[60px] bg-sky-500 rounded-t-lg transition-all group-hover:bg-sky-600 relative"
                                            style={{ height: `${data.average}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {data.average}%
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 mt-2">{data.grade}</p>
                                    </div>
                                )) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        No performance data available yet.
                                    </div>
                                )}
                            </div>
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-xs font-bold text-green-600 uppercase mb-1">Highest Performing</p>
                                    <p className="text-lg font-bold">{performanceData.reduce((prev, current) => (prev.average > current.average) ? prev : current, { grade: 'N/A' }).grade}</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                    <p className="text-xs font-bold text-red-600 uppercase mb-1">Needs Attention</p>
                                    <p className="text-lg font-bold">{performanceData.reduce((prev, current) => (prev.average < current.average) ? prev : current, { grade: 'N/A' }).grade}</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">Average School Score</p>
                                    <p className="text-lg font-bold">
                                        {(performanceData.reduce((acc, curr) => acc + parseFloat(curr.average), 0) / (performanceData.length || 1)).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SchoolManagerDashboard;
