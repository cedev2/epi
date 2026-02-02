import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import api from '../utils/api';
import {
    Layout,
    Award,
    BookOpen,
    Calendar,
    User,
    LogOut,
    GraduationCap,
    CheckCircle,
    Download
} from 'lucide-react';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [homework, setHomework] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [report, setReport] = useState({});
    const [syllabi, setSyllabi] = useState([]);
    const [rankings, setRankings] = useState({
        'Term 1': '--',
        'Term 2': '--',
        'Term 3': '--',
        'Annual': '--',
        total: '--'
    });
    const [activeTab, setActiveTab] = useState('report');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Fetch basic data first
                const [marksRes, syllabiRes, homeworkRes, calendarRes] = await Promise.all([
                    api.get('/marks/student'),
                    api.get('/syllabus'),
                    api.get('/homework'),
                    api.get('/calendar')
                ]);

                const reportMap = {};
                marksRes.data.forEach(m => {
                    const term = m.term || 'Term 1';
                    if (!reportMap[m.subject]) reportMap[m.subject] = {
                        'Term 1': { CAT: null, Exam: null, catMax: 100, examMax: 100 },
                        'Term 2': { CAT: null, Exam: null, catMax: 100, examMax: 100 },
                        'Term 3': { CAT: null, Exam: null, catMax: 100, examMax: 100 }
                    };
                    if (m.type === 'CAT') {
                        reportMap[m.subject][term].CAT = m.marks;
                        reportMap[m.subject][term].catMax = m.maxScore || 100;
                    } else if (m.type === 'Exam') {
                        reportMap[m.subject][term].Exam = m.marks;
                        reportMap[m.subject][term].examMax = m.maxScore || 100;
                    }
                });
                setReport(reportMap);
                setSyllabi(syllabiRes.data);
                setHomework(homeworkRes.data);
                setCalendarEvents(calendarRes.data);

                // Fetch rankings for all terms and annual
                if (user?.grade) {
                    try {
                        const [r1, r2, r3, rA] = await Promise.all([
                            api.get('/marks/rankings', { params: { grade: user.grade, term: 'Term 1' } }),
                            api.get('/marks/rankings', { params: { grade: user.grade, term: 'Term 2' } }),
                            api.get('/marks/rankings', { params: { grade: user.grade, term: 'Term 3' } }),
                            api.get('/marks/rankings', { params: { grade: user.grade } }), // Annual
                        ]);

                        const getR = (res) => res.data.rankings.find(r => r.studentId === user.id)?.rank || '--';

                        setRankings({
                            'Term 1': getR(r1),
                            'Term 2': getR(r2),
                            'Term 3': getR(r3),
                            'Annual': getR(rA),
                            total: r1.data.totalStudents || '--'
                        });
                    } catch (rankErr) {
                        console.error('Error fetching rankings:', rankErr);
                    }
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };
        fetchData();
    }, [user]);

    const handlePrintReport = () => {
        const originalTitle = document.title;
        document.title = "Student_Report_2026";
        window.print();
        document.title = originalTitle;
    };

    return (
        <div className="dashboard-layout">
            <aside className="dash-sidebar glass">
                <div className="sidebar-header pt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-8 h-8 text-primary" />
                        <h2 className="text-xl font-bold text-primary">Epintwari Portal</h2>
                    </div>
                </div>

                <div className="sidebar-profile">
                    <div className="profile-img-mini" style={{ background: '#e2e8f0', color: '#64748b' }}>
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] opacity-70 uppercase font-bold">{user?.grade || 'Student'}</p>
                        <p className="text-sm font-bold leading-tight">{user?.name}</p>
                    </div>
                </div>

                <nav className="sidebar-nav mt-8">
                    <button className={activeTab === 'report' ? 'active' : ''} onClick={() => setActiveTab('report')}>
                        <Award className="w-5 h-5 mr-3 inline" /> Term Report
                    </button>
                    <button className={activeTab === 'courses' ? 'active' : ''} onClick={() => setActiveTab('courses')}>
                        <BookOpen className="w-5 h-5 mr-3 inline" /> Syllabi
                    </button>
                    <button className={activeTab === 'homework' ? 'active' : ''} onClick={() => setActiveTab('homework')}>
                        <Calendar className="w-5 h-5 mr-3 inline" /> Homework
                    </button>
                    <button className={activeTab === 'calendar' ? 'active' : ''} onClick={() => setActiveTab('calendar')}>
                        <Calendar className="w-5 h-5 mr-3 inline" /> Calendar
                    </button>
                    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                        <User className="w-5 h-5 mr-3 inline" /> Profile
                    </button>
                    <button className="logout-btn" onClick={logout}>
                        <LogOut className="w-5 h-5 mr-3 inline" /> Logout
                    </button>
                </nav>
            </aside>

            <main className="dash-main">
                <header className="student-banner">
                    <div className="student-info-box">
                        <div className="student-avatar" style={{ background: '#6366f1' }}>
                            <GraduationCap className="w-10 h-10" />
                        </div>
                        <div className="student-details">
                            <div className="flex items-center gap-3">
                                <h2>{user?.name}</h2>
                            </div>
                            <p className="text-sm">Assigned Class: {user?.grade} • ID: {user?.regNumber}</p>
                        </div>
                    </div>
                </header>

                <div className="dash-content">
                    {activeTab === 'report' && (
                        <div className="dash-card print-section">
                            <div className="report-header-top mb-8 border-b pb-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-6">
                                        <img src="/logo.png" alt="School Logo" className="w-24 h-24 object-contain" />
                                        <div>
                                            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">Ecole Primary Intwali</h1>
                                            <p className="text-sm font-bold text-primary tracking-widest uppercase mb-1">Intwari Primary School</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase my-2 italic tracking-[0.2em]">"UBURERE - UBUMENYI - UBUTWARI"</p>
                                            <div className="flex flex-col text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                <span>Nyarugenge District, Kigali City</span>
                                                <span>Tel: +250 788 000 000 / +250 788 111 222</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-xl min-w-[240px]">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Student Full Name</p>
                                            <p className="text-xl font-black uppercase tracking-tight">{user?.name}</p>
                                            <div className="h-px bg-white/20 my-2"></div>
                                            <div className="flex justify-between text-[10px] font-bold uppercase opacity-80">
                                                <span>ID: {user?.regNumber}</span>
                                                <span>Class: {user?.grade}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 no-print mt-2">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Year: 2026</div>
                                            <button onClick={handlePrintReport} className="btn-primary flex items-center gap-2 text-xs px-4 py-2 rounded-xl">
                                                <Download className="w-3 h-3" /> PDF / Print
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="dash-table report-professional">
                                <thead>
                                    <tr>
                                        <th rowSpan="2" className="border">Subject</th>
                                        <th colSpan="3" className="text-center border bg-slate-50">Term 1</th>
                                        <th colSpan="3" className="text-center border bg-slate-50">Term 2</th>
                                        <th colSpan="3" className="text-center border bg-slate-50">Term 3</th>
                                        <th rowSpan="2" className="text-center border">Annual Avg</th>
                                        <th rowSpan="2" className="text-right border">Observation</th>
                                    </tr>
                                    <tr>
                                        <th className="text-center border text-[10px]">CAT</th>
                                        <th className="text-center border text-[10px]">EXAM</th>
                                        <th className="text-center border text-[10px] bg-indigo-50">AVG</th>
                                        <th className="text-center border text-[10px]">CAT</th>
                                        <th className="text-center border text-[10px]">EXAM</th>
                                        <th className="text-center border text-[10px] bg-indigo-50">AVG</th>
                                        <th className="text-center border text-[10px]">CAT</th>
                                        <th className="text-center border text-[10px]">EXAM</th>
                                        <th className="text-center border text-[10px] bg-indigo-50">AVG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda', 'Religious', 'Sport', 'Art and Craft', 'General'].map(subject => {
                                        const subData = report[subject] || {
                                            'Term 1': { CAT: null, Exam: null, catMax: 100, examMax: 100 },
                                            'Term 2': { CAT: null, Exam: null, catMax: 100, examMax: 100 },
                                            'Term 3': { CAT: null, Exam: null, catMax: 100, examMax: 100 }
                                        };

                                        const calculateTermAvg = (term) => {
                                            const data = subData[term];
                                            if (data.CAT === null && data.Exam === null) return null;

                                            const catPerc = data.CAT !== null ? (data.CAT / data.catMax) * 100 : null;
                                            const examPerc = data.Exam !== null ? (data.Exam / data.examMax) * 100 : null;

                                            if (catPerc !== null && examPerc !== null) return (catPerc + examPerc) / 2;
                                            return catPerc ?? examPerc;
                                        };

                                        const t1Avg = calculateTermAvg('Term 1');
                                        const t2Avg = calculateTermAvg('Term 2');
                                        const t3Avg = calculateTermAvg('Term 3');

                                        const avgs = [t1Avg, t2Avg, t3Avg].filter(a => a !== null);
                                        const annualAvg = avgs.length > 0 ? avgs.reduce((a, b) => a + b, 0) / avgs.length : null;

                                        return (
                                            <tr key={subject}>
                                                <td className="font-bold border">{subject}</td>

                                                {/* Term 1 */}
                                                <td className="text-center border text-xs">{subData['Term 1'].CAT !== null ? `${subData['Term 1'].CAT}/${subData['Term 1'].catMax}` : '--'}</td>
                                                <td className="text-center border text-xs">{subData['Term 1'].Exam !== null ? `${subData['Term 1'].Exam}/${subData['Term 1'].examMax}` : '--'}</td>
                                                <td className="text-center border font-bold bg-indigo-50/30 text-indigo-700">{t1Avg !== null ? `${t1Avg.toFixed(1)}%` : '--'}</td>

                                                {/* Term 2 */}
                                                <td className="text-center border text-xs">{subData['Term 2'].CAT !== null ? `${subData['Term 2'].CAT}/${subData['Term 2'].catMax}` : '--'}</td>
                                                <td className="text-center border text-xs">{subData['Term 2'].Exam !== null ? `${subData['Term 2'].Exam}/${subData['Term 2'].examMax}` : '--'}</td>
                                                <td className="text-center border font-bold bg-indigo-50/30 text-indigo-700">{t2Avg !== null ? `${t2Avg.toFixed(1)}%` : '--'}</td>

                                                {/* Term 3 */}
                                                <td className="text-center border text-xs">{subData['Term 3'].CAT !== null ? `${subData['Term 3'].CAT}/${subData['Term 3'].catMax}` : '--'}</td>
                                                <td className="text-center border text-xs">{subData['Term 3'].Exam !== null ? `${subData['Term 3'].Exam}/${subData['Term 3'].examMax}` : '--'}</td>
                                                <td className="text-center border font-bold bg-indigo-50/30 text-indigo-700">{t3Avg !== null ? `${t3Avg.toFixed(1)}%` : '--'}</td>

                                                <td className="text-center font-bold border bg-slate-50">
                                                    {annualAvg !== null ? `${annualAvg.toFixed(1)}%` : '--'}
                                                </td>
                                                <td className="text-right border">
                                                    {annualAvg !== null ? (
                                                        <span className={`badge ${annualAvg >= 50 ? 'pass' : 'fail'}`}>
                                                            {annualAvg >= 50 ? 'COMPETENT' : 'NOT YET'}
                                                        </span>
                                                    ) : <span className="text-slate-300">--</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {/* Position Row */}
                                    <tr className="position-row">
                                        <td className="font-black bg-slate-100 uppercase text-[10px] p-4 border">Class Position</td>
                                        <td colSpan="3" className="text-center font-black text-lg bg-indigo-50/30 border">
                                            {rankings['Term 1'] !== '--' ? `#${rankings['Term 1']} / ${rankings.total}` : '--'}
                                        </td>
                                        <td colSpan="3" className="text-center font-black text-lg bg-indigo-50/30 border">
                                            {rankings['Term 2'] !== '--' ? `#${rankings['Term 2']} / ${rankings.total}` : '--'}
                                        </td>
                                        <td colSpan="3" className="text-center font-black text-lg bg-indigo-50/30 border">
                                            {rankings['Term 3'] !== '--' ? `#${rankings['Term 3']} / ${rankings.total}` : '--'}
                                        </td>
                                        <td className="text-center font-black text-lg bg-primary text-white border">
                                            {rankings['Annual'] !== '--' ? `#${rankings['Annual']} / ${rankings.total}` : '--'}
                                        </td>
                                        <td className="bg-slate-100 border"></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="report-footer-section">
                                {(() => {
                                    // Calculate overall annual average for promotion logic
                                    const allAvgs = Object.values(report).map(sub => {
                                        const calc = (t) => {
                                            const data = sub[t];
                                            if (data.CAT === null && data.Exam === null) return null;
                                            const cP = data.CAT !== null ? (data.CAT / data.catMax) * 100 : null;
                                            const eP = data.Exam !== null ? (data.Exam / data.examMax) * 100 : null;
                                            return (cP !== null && eP !== null) ? (cP + eP) / 2 : (cP ?? eP);
                                        };
                                        const tAvgs = ['Term 1', 'Term 2', 'Term 3'].map(calc).filter(a => a !== null);
                                        return tAvgs.length > 0 ? tAvgs.reduce((a, b) => a + b, 0) / tAvgs.length : null;
                                    }).filter(a => a !== null);
                                    const grandAvg = allAvgs.length > 0 ? allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length : 0;
                                    const isPromoted = grandAvg >= 50;

                                    return (
                                        <div className="decision-box">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-3">Decision of the Class Council</p>
                                            <div className={`decision-item ${isPromoted ? 'selected' : ''}`}>
                                                <div className="decision-checkbox">
                                                    {isPromoted && <CheckCircle className="w-3 h-3" />}
                                                </div>
                                                PROMOTED
                                            </div>
                                            <div className={`decision-item ${!isPromoted ? 'selected' : ''}`}>
                                                <div className="decision-checkbox">
                                                    {!isPromoted && <CheckCircle className="w-3 h-3" />}
                                                </div>
                                                REPEAT
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="signature-grid">
                                    <div>
                                        <div className="sig-line"></div>
                                        <p className="sig-label">Class Teacher's Signature</p>
                                    </div>
                                    <div>
                                        <div className="sig-line"></div>
                                        <p className="sig-label">Head Teacher's Signature</p>
                                    </div>
                                </div>
                                <div className="print-branding-footer">
                                    Generated by Heloxtech
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'courses' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {syllabi.map(sby => (
                                <div key={sby.id} className="dash-card border-t-4 border-primary hover:shadow-xl transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <BookOpen className="w-10 h-10 text-primary" />
                                        <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">PDF</span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1">{sby.subject}</h4>
                                    <p className="text-xs text-slate-400 mb-4 font-bold uppercase">{sby.grade} Study Resource</p>
                                    <a
                                        href={`http://localhost:5000${sby.fileUrl}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 text-primary font-bold rounded-lg border border-slate-100 hover:bg-primary hover:text-white transition-all"
                                    >
                                        <Download className="w-4 h-4" /> Download Syllabus
                                    </a>
                                </div>
                            ))}
                            {syllabi.length === 0 && (
                                <div className="col-span-full py-12 text-center dash-card bg-slate-50/50">
                                    <p className="text-slate-500 font-bold italic">No learning materials have been uploaded for {user?.grade} yet.</p>
                                    <p className="text-xs text-slate-400 mt-2">Check back later once your teachers publish the term resources.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'homework' && (
                        <div className="dash-card">
                            <h3 className="text-xl font-bold mb-6">Homework & Assignments</h3>
                            <div className="space-y-4">
                                {homework.map(hw => (
                                    <div key={hw.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded mb-2 inline-block">{hw.subject}</span>
                                                <h4 className="font-bold text-lg">{hw.title}</h4>
                                                <p className="text-sm text-slate-600 mt-1">{hw.description}</p>
                                                <p className="text-xs text-slate-400 mt-3 font-bold">Due: {hw.dueDate}</p>
                                            </div>
                                            {hw.fileUrl && (
                                                <a href={`http://localhost:5000${hw.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary font-bold text-sm hover:underline">
                                                    <Download className="w-4 h-4" /> Resource
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {homework.length === 0 && (
                                    <p className="text-center text-slate-400 py-8 italic">No homework assigned yet.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'calendar' && (
                        <div className="dash-card">
                            <h3 className="text-xl font-bold mb-6">2026 Academic Calendar</h3>
                            <div className="space-y-4">
                                {calendarEvents.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-white inset-shadow border border-slate-100 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-10 rounded-full ${item.type === 'Exam' ? 'bg-red-500' : item.type === 'Holiday' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                            <div>
                                                <span className="font-bold block">{item.title}</span>
                                                <span className="text-xs text-slate-500">{item.description}</span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-mono text-slate-400 font-bold">{item.date}</span>
                                    </div>
                                ))}
                                {calendarEvents.length === 0 && (
                                    <p className="text-center text-slate-400 py-8 italic">No calendar events found.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="dash-card max-w-md">
                            <h3 className="text-xl font-bold mb-6">Profile Details</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                                    <p className="font-bold text-slate-700">{user?.name}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Assigned Grade</label>
                                    <p className="font-bold text-primary">{user?.grade}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Student Reg ID</label>
                                    <p className="font-mono font-bold text-slate-700">{user?.regNumber}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main >
        </div >
    );
};

export default StudentDashboard;
