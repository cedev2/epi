import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import './Dashboard.css';

const Dashboard = () => {
    const [role, setRole] = useState(localStorage.getItem('userRole') || 'student');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const AccountantDashboard = () => {
        return (
            <div className="accountant-dashboard">
                <h2 className="dash-title">Financial Portal</h2>
                <div className="stats-row">
                    <div className="stat-card glass">
                        <span className="label">Total Fees Collected</span>
                        <span className="value">12.5M RWF</span>
                    </div>
                    <div className="stat-card glass">
                        <span className="label">Outstanding</span>
                        <span className="value">4.2M RWF</span>
                    </div>
                </div>

                <div className="dash-card glass mt-2">
                    <h3>Fee Payment Status</h3>
                    <table className="dash-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Term</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>STU001</td><td>John Doe</td><td>Term 1</td><td><span className="badge pass">Paid</span></td></tr>
                            <tr><td>STU002</td><td>Jane Smith</td><td>Term 1</td><td><span className="badge fail">Pending</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard-layout">
            <aside className="dash-sidebar glass">
                <div className="sidebar-header">
                    <h3>EPINTWARI CMS</h3>
                    <span className="role-badge">{role.toUpperCase()}</span>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard">Overview</Link>
                    {role === 'student' && <Link to="/dashboard/report">My Report</Link>}
                    {role === 'teacher' && <Link to="/dashboard/marks">Class Marks</Link>}
                    {role === 'accountant' && <Link to="/dashboard/fees">Fee Records</Link>}
                    <Link to="/dashboard/profile">Profile</Link>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </nav>
            </aside>

            <main className="dash-main">
                <Routes>
                    <Route path="/" element={
                        role === 'student' ? <StudentDashboard /> :
                            role === 'teacher' ? <TeacherDashboard /> :
                                <AccountantDashboard />
                    } />
                    <Route path="/report" element={<StudentDashboard />} />
                    <Route path="/marks" element={<TeacherDashboard />} />
                    <Route path="/fees" element={<AccountantDashboard />} />
                    <Route path="/profile" element={<div className="dash-card glass"><h2>Profile Settings</h2><p>Coming soon...</p></div>} />
                </Routes>
            </main>
        </div>
    );
};

export default Dashboard;
