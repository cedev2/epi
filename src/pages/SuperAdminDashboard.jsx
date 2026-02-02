import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import api from '../utils/api';
import {
    Users,
    Layout,
    LogOut,
    ShieldCheck,
    User,
    BookOpen,
    GraduationCap,
    Calendar,
    Settings,
    Bell,
    Trash2,
    ArrowRight,
    PieChart,
    BarChart
} from 'lucide-react';

const SuperAdminDashboard = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('home');
    const [userRoleTab, setUserRoleTab] = useState('student'); // 'student', 'teacher', 'manager'
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'student',
        initialPassword: '',
        grade: 'Grade 1',
        subject: 'General'
    });
    const [stats, setStats] = useState({ counts: { students: 0, teachers: 0, managers: 0 }, performance: { averageScore: 0 }, gradeDistribution: [] });
    const [loading, setLoading] = useState(true);

    const roleColors = {
        student: { main: '#0ea5e9', light: '#e0f2fe', text: '#0369a1' }, // Blue
        teacher: { main: '#a855f7', light: '#f3e8ff', text: '#7e22ce' }, // Purple
        manager: { main: '#10b981', light: '#d1fae5', text: '#047857' } // Emerald
    };

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/analytics/stats'),
                api.get('/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            let userToCreate = {
                ...newUser,
                password: newUser.initialPassword || 'password123'
            };

            if (newUser.role === 'student') {
                const nextId = users.filter(u => u.role === 'student').length + 1;
                const regNumber = `26EPI${String(nextId).padStart(4, '0')}`;
                userToCreate.regNumber = regNumber;
                // Force password to be regNumber if initially blank
                userToCreate.password = newUser.initialPassword || regNumber;
                userToCreate.email = newUser.email || `${regNumber}@epintwali.edu.rw`;
            }

            await api.post('/users', userToCreate);
            fetchData();
            setNewUser({
                name: '',
                email: '',
                role: 'student',
                initialPassword: '',
                grade: 'Grade 1',
                subject: 'General'
            });
            alert(`${newUser.role} added successfully!`);
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding user');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${editingUser.id}`, editingUser);
            fetchData();
            setEditingUser(null);
            alert('User updated successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating user');
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting user');
            }
        }
    };


    return (
        <div className="dashboard-layout">
            <aside className="dash-sidebar dark">
                <div className="sidebar-header pt-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm border border-slate-100 p-1">
                            <img src="/teacher icon.png" alt="Admin" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-wider">Welcome</p>
                            <h2 className="text-sm font-bold text-white leading-tight">{user?.name || 'Administrator'}</h2>
                        </div>
                    </div>
                </div>

                <div className="sidebar-profile">
                    <div className="profile-img-mini overflow-hidden">
                        <img src="/teacher icon.png" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-xs opacity-70">Management</p>
                        <p className="text-sm font-bold leading-tight">{user?.role}</p>
                    </div>
                </div>

                <nav className="sidebar-nav mt-4">
                    <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
                        <Layout className="w-5 h-5 mr-3 inline" /> Home
                    </button>
                    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                        <User className="w-5 h-5 mr-3 inline" /> Update Profile
                    </button>
                    <button className={activeTab === 'course' ? 'active' : ''} onClick={() => setActiveTab('course')}>
                        <BookOpen className="w-5 h-5 mr-3 inline" /> Course
                    </button>
                    <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                        <Users className="w-5 h-5 mr-3 inline" /> Manage Staff
                    </button>
                    <button className="logout-btn" onClick={logout}>
                        <LogOut className="w-5 h-5 mr-3 inline" /> Logout
                    </button>
                </nav>
            </aside>

            <main className="dash-main">
                <header className="flex justify-between items-center mb-8 border-b pb-4">
                    <h1 className="text-2xl font-bold text-blue-800">College Management System</h1>
                    <div className="text-sm font-bold text-slate-500">Academic Year: 2026</div>
                </header>

                {activeTab === 'home' && (
                    <div className="dash-content">
                        {/* Summary Cards */}
                        <div className="summary-grid">
                            <div className="summary-card" style={{ borderLeft: `6px solid ${roleColors.student.main}` }}>
                                <div className="info">
                                    <div className="number" style={{ color: roleColors.student.main }}>{stats.counts.students}</div>
                                    <div className="label">Total Students</div>
                                </div>
                                <GraduationCap className="icon-overlay" style={{ color: roleColors.student.main, opacity: 0.1 }} />
                                <div className="more-info" style={{ color: roleColors.student.main }}>Registered Enrollment →</div>
                            </div>
                            <div className="summary-card" style={{ borderLeft: `6px solid ${roleColors.teacher.main}` }}>
                                <div className="info">
                                    <div className="number" style={{ color: roleColors.teacher.main }}>{stats.counts.teachers}</div>
                                    <div className="label">Faculty Staff</div>
                                </div>
                                <Users className="icon-overlay" style={{ color: roleColors.teacher.main, opacity: 0.1 }} />
                                <div className="more-info" style={{ color: roleColors.teacher.main }}>Manage Personnel →</div>
                            </div>
                            <div className="summary-card" style={{ borderLeft: `6px solid #64748b` }}>
                                <div className="info">
                                    <div className="number" style={{ color: '#64748b' }}>{stats.performance.averageScore}%</div>
                                    <div className="label">Avg Performance</div>
                                </div>
                                <BarChart className="icon-overlay" style={{ color: '#64748b', opacity: 0.1 }} />
                                <div className="more-info" style={{ color: '#64748b' }}>Academic Score →</div>
                            </div>
                            <div className="summary-card" style={{ borderLeft: `6px solid ${roleColors.manager.main}` }}>
                                <div className="info">
                                    <div className="number" style={{ color: roleColors.manager.main }}>{stats.counts.managers}</div>
                                    <div className="label">Admin / Managers</div>
                                </div>
                                <ShieldCheck className="icon-overlay" style={{ color: roleColors.manager.main, opacity: 0.1 }} />
                                <div className="more-info" style={{ color: roleColors.manager.main }}>System Access →</div>
                            </div>
                        </div>

                        {/* Analytics Row */}
                        <div className="analytics-row">
                            <div className="analytics-card">
                                <div className="analytics-card-header">
                                    <span>Grade Distribution</span>
                                </div>
                                <div className="flex items-end justify-around h-64 border-l border-b pt-4 px-4 bg-slate-50/50 italic text-slate-400">
                                    {stats.gradeDistribution.map(g => (
                                        <div key={g.grade} className="flex flex-col items-center gap-2 group w-full">
                                            <div
                                                className="w-8 bg-sky-500 rounded-t-sm transition-all duration-500 hover:bg-sky-600"
                                                style={{ height: `${(g.count / stats.counts.students) * 100}%` || '10%' }}
                                                title={`${g.count} students`}
                                            ></div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">{g.grade}</span>
                                        </div>
                                    ))}
                                    {stats.gradeDistribution.length === 0 && <p className="text-sm">No enrollment data</p>}
                                </div>
                            </div>

                            <div className="analytics-card">
                                <div className="analytics-card-header">
                                    <span>System Composition</span>
                                </div>
                                <div className="flex flex-col items-center justify-center h-64">
                                    <div
                                        className="w-48 h-48 rounded-full border-8 border-white shadow-xl relative flex items-center justify-center"
                                        style={{ background: `conic-gradient(#0ea5e9 0% ${(stats.counts.students / (users.length || 1)) * 100}%, #f43f5e ${(stats.counts.students / (users.length || 1)) * 100}% 100%)` }}
                                    >
                                        <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                                            <span className="text-2xl font-black text-slate-700">{users.length}</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                                            <span className="text-[10px] font-bold uppercase">Students</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                                            <span className="text-[10px] font-bold uppercase">Staff</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="dash-card lg:col-span-1">
                            <h3 className="text-xl font-bold mb-6">Add New User</h3>
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Full Name</label>
                                    <input type="text" className="w-full p-2 border rounded-lg" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Role</label>
                                    <select className="w-full p-2 border rounded-lg" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="manager">School Manager</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        {newUser.role === 'student' ? 'Email (Optional)' : 'Email'}
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full p-2 border rounded-lg"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        required={newUser.role !== 'student'}
                                        placeholder={newUser.role === 'student' ? 'Auto-generated if empty' : 'Enter email'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Initial Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-2 border rounded-lg"
                                        value={newUser.initialPassword}
                                        onChange={(e) => setNewUser({ ...newUser, initialPassword: e.target.value })}
                                        placeholder={newUser.role === 'student' ? 'Reg Number if empty' : 'password123'}
                                    />
                                </div>
                                {newUser.role === 'student' && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Grade / Class</label>
                                        <select className="w-full p-2 border rounded-lg" value={newUser.grade} onChange={(e) => setNewUser({ ...newUser, grade: e.target.value })}>
                                            {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {newUser.role === 'teacher' && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Assigned Subject</label>
                                        <select className="w-full p-2 border rounded-lg" value={newUser.subject} onChange={(e) => setNewUser({ ...newUser, subject: e.target.value })}>
                                            {['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <button type="submit" className="btn btn-primary w-full mt-4">Create Account</button>
                            </form>
                        </div>
                        <div className="dash-card lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Manage Personnel</h3>
                                <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                                    {['student', 'teacher', 'manager'].map(role => (
                                        <button
                                            key={role}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize ${userRoleTab === role ? 'shadow-sm text-white' : 'text-slate-500 hover:bg-white/50'}`}
                                            style={userRoleTab === role ? { backgroundColor: roleColors[role].main } : {}}
                                            onClick={() => setUserRoleTab(role)}
                                        >
                                            {role}s
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="dash-table">
                                    <thead style={{ borderBottom: `2px solid ${roleColors[userRoleTab].main}` }}>
                                        <tr>
                                            <th>Full Name</th>
                                            <th>Credentials</th>
                                            {userRoleTab === 'student' && <th>Grade</th>}
                                            {userRoleTab === 'teacher' && <th>Subject</th>}
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.filter(u => u.role === userRoleTab).map(u => (
                                            <tr key={u.id}>
                                                <td className="font-bold text-sm">{u.name}</td>
                                                <td className="text-xs font-mono text-slate-500">
                                                    {u.role === 'student' ? u.regNumber : u.email}
                                                </td>
                                                {userRoleTab === 'student' && <td className="text-xs font-bold" style={{ color: roleColors.student.main }}>{u.grade}</td>}
                                                {userRoleTab === 'teacher' && <td className="text-xs font-bold" style={{ color: roleColors.teacher.main }}>{u.subject}</td>}
                                                <td className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            onClick={() => setEditingUser(u)}
                                                            className="p-2 text-slate-400 hover:text-blue-500 transition-all"
                                                            title="Edit User"
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(u.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 transition-all"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.filter(u => u.role === userRoleTab).length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center py-8 text-slate-400 italic">No {userRoleTab}s found in database</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'course' && (
                    <div className="dash-card">
                        <h3 className="text-xl font-bold mb-6">Enrolled Courses</h3>
                        <p className="text-slate-500 italic">No courses added yet. System is in read-only mode for this demo.</p>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="dash-card max-w-md">
                        <h3 className="text-xl font-bold mb-6">Admin Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700">Display Name</label>
                                <input type="text" className="w-full p-2 border rounded-lg bg-slate-50" value={user?.name} readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700">Email</label>
                                <input type="text" className="w-full p-2 border rounded-lg bg-slate-50" value={user?.email} readOnly />
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {editingUser && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
                            <div className="p-6 border-b flex justify-between items-center" style={{ borderTop: `6px solid ${roleColors[editingUser.role]?.main || '#0ea5e9'}` }}>
                                <h3 className="text-xl font-bold text-slate-800">Edit {editingUser.role === 'student' ? 'Student' : 'Staff'}</h3>
                                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-slate-50 border rounded-xl"
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                        required
                                    />
                                </div>
                                {editingUser.role === 'student' ? (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Grade</label>
                                        <select
                                            className="w-full p-3 bg-slate-50 border rounded-xl"
                                            value={editingUser.grade}
                                            onChange={(e) => setEditingUser({ ...editingUser, grade: e.target.value })}
                                        >
                                            {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full p-3 bg-slate-50 border rounded-xl"
                                            value={editingUser.email}
                                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}
                                {editingUser.role === 'teacher' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                                        <select
                                            className="w-full p-3 bg-slate-50 border rounded-xl"
                                            value={editingUser.subject}
                                            onChange={(e) => setEditingUser({ ...editingUser, subject: e.target.value })}
                                        >
                                            {['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all"
                                        style={{ backgroundColor: roleColors[editingUser.role]?.main || '#0ea5e9' }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SuperAdminDashboard;
