import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import api from '../utils/api';
import {
    Users,
    Settings,
    LogOut,
    BookOpen,
    User,
    CheckCircle,
    UserCheck,
    ClipboardList,
    FileUp,
    Download,
    Trash2,
    PlusCircle
} from 'lucide-react';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const [homework, setHomework] = useState([]);
    const [newHomework, setNewHomework] = useState({ title: '', description: '', grade: user?.grade || '', subject: '', dueDate: '' });
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [rawMarks, setRawMarks] = useState([]);
    const [syllabi, setSyllabi] = useState([]);
    const [activeTab, setActiveTab] = useState('marks');
    const [markType, setMarkType] = useState('CAT');
    const [activeTerm, setActiveTerm] = useState('Term 1');
    const [quickEntry, setQuickEntry] = useState({ regNumber: '', studentId: '', name: '', score: '', maxScore: 100 });
    const [selectedFile, setSelectedFile] = useState(null);
    const [newSyllabus, setNewSyllabus] = useState({ subject: '', grade: user?.grade || '' });
    const [newPassword, setNewPassword] = useState('');
    const [activeSubject, setActiveSubject] = useState(user?.subject || 'Mathematics');

    const fetchData = async () => {
        try {
            const [usersRes, marksRes, syllabiRes, homeworkRes] = await Promise.all([
                api.get('/users'),
                api.get('/marks/student'),
                api.get('/syllabus'),
                api.get('/homework')
            ]);

            // Filter students by teacher's assigned grade
            setStudents(usersRes.data.filter(u => u.role === 'student' && u.grade === user?.grade));

            const marksMap = {};
            marksRes.data.forEach(m => {
                const term = m.term || 'Term 1';
                const key = `${m.studentId}_${m.type}_${term}`;
                if (!marksMap[key]) marksMap[key] = {};
                marksMap[key][m.subject] = m.marks;
            });
            setMarks(marksMap);
            setRawMarks(marksRes.data);
            setSyllabi(syllabiRes.data);
            setHomework(homeworkRes.data);
        } catch (error) {
            console.error('Error fetching teacher data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleLookup = async (reg) => {
        setQuickEntry(prev => ({ ...prev, regNumber: reg }));
        if (reg.length >= 5) {
            try {
                const res = await api.get('/users/lookup', { params: { regNumber: reg.trim() } });
                setQuickEntry(prev => ({ ...prev, studentId: res.data.id, name: res.data.name }));
            } catch (e) {
                setQuickEntry(prev => ({ ...prev, studentId: '', name: 'Not Found' }));
            }
        }
    };

    const handleSaveMarks = async (studentId, subject, value) => {
        try {
            const key = `${studentId}_${markType}_${activeTerm}`;
            const updatedMarks = {
                ...marks,
                [key]: {
                    ...(marks[key] || {}),
                    [subject]: value
                }
            };
            setMarks(updatedMarks);

            await api.post('/marks/submit', {
                studentId,
                subject,
                marks: parseFloat(value) || 0,
                maxScore: 100, // Default for table entry
                type: markType,
                term: activeTerm
            });
        } catch (error) {
            console.error('Error saving marks:', error);
            // alert(error.response?.data?.message || 'Error saving marks');
        }
    };

    const handleQuickSave = async (e) => {
        e.preventDefault();
        if (!quickEntry.studentId) return alert('Select a valid student');
        try {
            await api.post('/marks/submit', {
                studentId: quickEntry.studentId,
                subject: activeSubject,
                marks: parseFloat(quickEntry.score),
                maxScore: parseFloat(quickEntry.maxScore) || 100,
                type: markType,
                term: activeTerm
            });
            setQuickEntry({ regNumber: '', studentId: '', name: '', score: '', maxScore: 100 });
            fetchData();
            // alert('Mark submitted successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving mark');
        }
    };

    const handleUploadSyllabus = async (e) => {
        e.preventDefault();
        if (!selectedFile) return alert('Please select a PDF file');

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('subject', newSyllabus.subject);
        formData.append('grade', newSyllabus.grade);

        try {
            await api.post('/syllabus/upload', formData);
            fetchData();
            setSelectedFile(null);
            alert('Syllabus uploaded successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error uploading syllabus');
        }
    };

    const handleCreateHomework = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newHomework.title);
        formData.append('description', newHomework.description);
        formData.append('grade', newHomework.grade);
        formData.append('subject', newHomework.subject);
        formData.append('dueDate', newHomework.dueDate);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            await api.post('/homework', formData);
            fetchData();
            setNewHomework({ title: '', description: '', grade: user?.grade || '', subject: '', dueDate: '' });
            setSelectedFile(null);
            alert('Homework assigned successfully!');
        } catch (error) {
            console.error('Error assigning homework:', error);
            alert(error.response?.data?.message || 'Error assigning homework');
        }
    };

    const deleteSyllabus = async (id) => {
        if (window.confirm('Delete this syllabus?')) {
            try {
                await api.delete(`/syllabus/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting syllabus');
            }
        }
    };

    const deleteHomework = async (id) => {
        if (window.confirm('Delete this homework?')) {
            try {
                await api.delete(`/homework/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting homework');
            }
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="dash-sidebar glass">
                <div className="sidebar-header pt-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm border border-slate-100 p-1">
                            <img src="/teacher icon.png" alt="Teacher" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-wider">Welcome</p>
                            <h2 className="text-sm font-bold text-slate-700 leading-tight">{user?.name}</h2>
                        </div>
                    </div>
                </div>

                <div className="sidebar-profile">
                    <div className="profile-img-mini overflow-hidden">
                        <img src="/teacher icon.png" alt="Teacher" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-[10px] opacity-70 uppercase font-bold">Faculty • {user?.subject}</p>
                        <p className="text-sm font-bold leading-tight">{user?.name}</p>
                    </div>
                </div>

                <nav className="sidebar-nav mt-4">
                    <button className={activeTab === 'marks' ? 'active' : ''} onClick={() => setActiveTab('marks')}>
                        <ClipboardList className="w-5 h-5 mr-3 inline" /> Grading
                    </button>
                    <button className={activeTab === 'syllabus' ? 'active' : ''} onClick={() => setActiveTab('syllabus')}>
                        <FileUp className="w-5 h-5 mr-3 inline" /> Syllabi
                    </button>
                    <button className={activeTab === 'homework' ? 'active' : ''} onClick={() => setActiveTab('homework')}>
                        <BookOpen className="w-5 h-5 mr-3 inline" /> Homework
                    </button>
                    <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
                        <Settings className="w-5 h-5 mr-3 inline" /> History
                    </button>
                    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                        <Settings className="w-5 h-5 mr-3 inline" /> Account
                    </button>
                    <button className="logout-btn" onClick={logout}>
                        <LogOut className="w-5 h-5 mr-3 inline" /> Logout
                    </button>
                </nav>
            </aside>

            <main className="dash-main">
                <header className="student-banner">
                    <div className="student-info-box">
                        <div className="student-avatar overflow-hidden" style={{ background: '#ffffff' }}>
                            <img src="/teacher icon.png" alt="Teacher Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">Welcome, {user?.name || 'Teacher'}</h2>
                            <p className="text-sm text-white/80">Logged in as: <span className="font-bold">{user?.email || user?.regNumber}</span> • Assigned Subject: <span className="font-bold">{user?.subject || 'Not Set'}</span> • Total Students: {students.length}</p>
                        </div>
                    </div>
                </header>

                <div className="dash-content">
                    {activeTab === 'marks' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="dash-card">
                                    <h3 className="text-xl font-bold mb-6">Quick Mark Entry</h3>
                                    <form onSubmit={handleQuickSave} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Reg Number</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 2024/001"
                                                value={quickEntry.regNumber}
                                                onChange={(e) => handleLookup(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Student Name</label>
                                            <input type="text" value={quickEntry.name} readOnly placeholder="Search result..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Subject</label>
                                            <select
                                                className="w-full p-2 border rounded-lg"
                                                value={activeSubject}
                                                onChange={(e) => setActiveSubject(e.target.value)}
                                            >
                                                {['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda', 'Religious', 'Sport', 'Art and Craft'].map(subj => (
                                                    <option key={subj} value={subj}>{subj}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Obtained</label>
                                            <input
                                                type="number"
                                                value={quickEntry.score}
                                                onChange={(e) => setQuickEntry({ ...quickEntry, score: e.target.value })}
                                                max={quickEntry.maxScore} min="0" required
                                                placeholder="Score"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Out of</label>
                                            <input
                                                type="number"
                                                value={quickEntry.maxScore}
                                                onChange={(e) => setQuickEntry({ ...quickEntry, maxScore: e.target.value })}
                                                min="1" required
                                                placeholder="Max Score"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Type</label>
                                            <select
                                                className="w-full p-2 border rounded-lg"
                                                value={markType}
                                                onChange={(e) => setMarkType(e.target.value)}
                                            >
                                                <option value="CAT">CAT</option>
                                                <option value="Exam">Exam</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                                            <PlusCircle className="w-5 h-5" /> Submit Assessment Marks
                                        </button>
                                        <p className="text-[10px] text-slate-400 text-center mt-2 italic font-bold">
                                            * Assessments are added to previous marks. Total should reach 100%.
                                        </p>
                                    </form>
                                </div>

                                <div className="dash-card">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold">Assessment Gradebook</h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase mt-1">Classification: {markType}</p>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <select
                                                className="px-4 py-2 border rounded-lg text-sm font-bold text-primary bg-white"
                                                value={activeTerm}
                                                onChange={(e) => setActiveTerm(e.target.value)}
                                            >
                                                {['Term 1', 'Term 2', 'Term 3'].map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                            <select
                                                className="px-4 py-2 border rounded-lg text-sm font-bold text-primary bg-white"
                                                value={activeSubject}
                                                onChange={(e) => setActiveSubject(e.target.value)}
                                            >
                                                {['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda', 'Religious', 'Sport', 'Art and Craft'].map(subj => (
                                                    <option key={subj} value={subj}>{subj}</option>
                                                ))}
                                            </select>
                                            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                                                <button
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${markType === 'CAT' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
                                                    onClick={() => setMarkType('CAT')}
                                                >
                                                    CAT Score
                                                </button>
                                                <button
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${markType === 'Exam' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
                                                    onClick={() => setMarkType('Exam')}
                                                >
                                                    Final Exam
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="dash-table">
                                            <thead>
                                                <tr>
                                                    <th>Student Name</th>
                                                    <th>Reg Number</th>
                                                    <th className="text-center">{activeSubject} Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.map(s => (
                                                    <tr key={s.id}>
                                                        <td className="font-bold">{s.name}</td>
                                                        <td className="font-mono text-xs text-slate-500">{s.regNumber}</td>
                                                        <td className="text-center">
                                                            <input
                                                                type="number"
                                                                value={marks[`${s.id}_${markType}_${activeTerm}`]?.[activeSubject] || ''}
                                                                onChange={(e) => handleSaveMarks(s.id, activeSubject, e.target.value)}
                                                                className="text-center w-24 mx-auto"
                                                                placeholder="Mark"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'syllabus' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="dash-card lg:col-span-1">
                                <h3 className="text-lg font-bold mb-4">Upload Multi-Media Syllabus</h3>
                                <form onSubmit={handleUploadSyllabus} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Target PDF File</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">Target Grade</label>
                                            <select
                                                className="w-full p-2 border rounded-lg text-sm"
                                                value={newSyllabus.grade}
                                                onChange={(e) => setNewSyllabus({ ...newSyllabus, grade: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Grade</option>
                                                {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map(g => (
                                                    <option key={g} value={g}>{g}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                                            <select
                                                className="w-full p-2 border rounded-lg text-sm"
                                                value={newSyllabus.subject}
                                                onChange={(e) => setNewSyllabus({ ...newSyllabus, subject: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Subject</option>
                                                {['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda', 'Religious', 'Sport', 'Art and Craft', 'General'].map(subj => (
                                                    <option key={subj} value={subj}>{subj}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                        <FileUp className="w-4 h-4" /> Finalize Distribution
                                    </button>
                                </form>
                            </div>
                            <div className="dash-card lg:col-span-2">
                                <h3 className="text-lg font-bold mb-4">Active Syllabi</h3>
                                <div className="space-y-3">
                                    {syllabi.map(sby => (
                                        <div key={sby.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <BookOpen className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{sby.subject}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold">{sby.grade} • Material</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <a href={`http://localhost:5000${sby.fileUrl}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-primary transition-all">
                                                    <Download className="w-5 h-5" />
                                                </a>
                                                <button onClick={() => deleteSyllabus(sby.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {syllabi.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No syllabi uploaded for your grade yet.</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'homework' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="dash-card lg:col-span-1">
                                <h3 className="text-lg font-bold mb-4">Assign Homework</h3>
                                <form onSubmit={handleCreateHomework} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded-lg text-sm"
                                            value={newHomework.title}
                                            onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                                        <textarea
                                            className="w-full p-2 border rounded-lg text-sm"
                                            rows="3"
                                            value={newHomework.description}
                                            onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            className="w-full p-2 border rounded-lg text-sm"
                                            value={newHomework.dueDate}
                                            onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Resource (Optional)</label>
                                        <input
                                            type="file"
                                            className="w-full text-sm"
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">Grade</label>
                                            <select
                                                className="w-full p-2 border rounded-lg text-sm"
                                                value={newHomework.grade}
                                                onChange={(e) => setNewHomework({ ...newHomework, grade: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Grade</option>
                                                {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map(g => (
                                                    <option key={g} value={g}>{g}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                                            <select
                                                className="w-full p-2 border rounded-lg text-sm"
                                                value={newHomework.subject}
                                                onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Subject</option>
                                                {['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda', 'Religious', 'Sport', 'Art and Craft', 'General'].map(subj => (
                                                    <option key={subj} value={subj}>{subj}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-all">
                                        Assign Homework
                                    </button>
                                </form>
                            </div>
                            <div className="dash-card lg:col-span-2">
                                <h3 className="text-lg font-bold mb-4">Assignment History</h3>
                                <div className="space-y-3">
                                    {homework.map(hw => (
                                        <div key={hw.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div>
                                                <p className="font-bold text-sm">{hw.title}</p>
                                                <p className="text-xs text-slate-500">{hw.description}</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Due: {hw.dueDate} • {hw.grade}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {hw.fileUrl && (
                                                    <a href={`http://localhost:5000${hw.fileUrl}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-primary transition-all">
                                                        <Download className="w-5 h-5" />
                                                    </a>
                                                )}
                                                <button onClick={() => deleteHomework(hw.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {homework.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No homework assigned yet.</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="dash-card">
                                <h3 className="text-xl font-bold mb-6">Marks History</h3>
                                <div className="overflow-x-auto">
                                    <table className="dash-table">
                                        <thead>
                                            <tr>
                                                <th>Student ID</th>
                                                <th>Subject</th>
                                                <th>Type</th>
                                                <th className="text-center">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rawMarks.map((m, idx) => (
                                                <tr key={idx}>
                                                    <td className="font-mono text-xs">{m.studentId}</td>
                                                    <td className="text-sm font-bold">{m.subject}</td>
                                                    <td className="text-xs uppercase">{m.type}</td>
                                                    <td className="text-center font-bold">{m.marks}</td>
                                                </tr>
                                            ))}
                                            {rawMarks.length === 0 && (
                                                <tr><td colSpan="4" className="text-center py-4 text-slate-400">No marks recorded</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="dash-card">
                                <h3 className="text-xl font-bold mb-6">Assignment History</h3>
                                <div className="space-y-3">
                                    {homework.map(hw => (
                                        <div key={hw.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div>
                                                <p className="font-bold text-sm">{hw.title}</p>
                                                <p className="text-xs text-slate-500">{hw.description}</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Due: {hw.dueDate}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {homework.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No homework assigned yet.</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="dash-card max-w-md">
                            <h3 className="text-xl font-bold mb-6">Security Settings</h3>
                            <form onSubmit={(e) => { e.preventDefault(); alert('Password updated!'); setNewPassword(''); }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary outline-none"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        placeholder="Minimum 8 characters"
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all">
                                    Update Password
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
