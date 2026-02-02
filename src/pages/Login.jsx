import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
    const [loginType, setLoginType] = useState('student'); // 'student' or 'staff'
    const [identifier, setIdentifier] = useState(''); // Email or Reg Number
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', {
                identifier: identifier.trim(),
                password
            });

            const userData = response.data;
            login(userData);

            const path = userData.role === 'admin' ? '/dashboard/admin' :
                userData.role === 'manager' ? '/dashboard/manager' :
                    userData.role === 'teacher' ? '/dashboard/teacher' :
                        '/dashboard/student';
            navigate(path);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-32 pb-12 bg-gradient-to-br from-[#E0E7FF] via-[#DBEAFE] to-[#E0E7FF] font-['Outfit']">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[460px] px-4"
            >
                <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(26,79,139,0.15)] overflow-hidden border border-white">
                    {/* Role Selection Tabs */}
                    <div className="flex bg-slate-50 p-2">
                        <button
                            className={`flex-1 py-3 rounded-2xl font-bold transition-all ${loginType === 'student' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                            onClick={() => { setLoginType('student'); setError(''); setIdentifier(''); setPassword(''); }}
                        >
                            Student
                        </button>
                        <button
                            className={`flex-1 py-3 rounded-2xl font-bold transition-all ${loginType === 'staff' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                            onClick={() => { setLoginType('staff'); setError(''); setIdentifier(''); setPassword(''); }}
                        >
                            Staff Login
                        </button>
                    </div>

                    <div className="p-8 sm:p-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-slate-500">
                                {loginType === 'student' ? 'Enter your registration details' : 'Institutional staff access'}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 border border-red-100 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Identifier Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">
                                    {loginType === 'student' ? 'Registration Number' : 'Work Email'}
                                </label>
                                <input
                                    type={loginType === 'student' ? 'text' : 'email'}
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder={loginType === 'student' ? 'e.g. 26EPIXXXX' : 'Email Address'}
                                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-slate-700">
                                        Password
                                    </label>
                                    {loginType === 'student' && <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Note: Default is Reg No</span>}
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="e.g. 26EPIXXXX"
                                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                />
                            </div>

                            {/* Show Password */}
                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer select-none group">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={showPassword}
                                        onChange={(e) => setShowPassword(e.target.checked)}
                                    />
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded-md bg-white peer-checked:bg-primary peer-checked:border-primary transition-all duration-200" />
                                    <span className="ml-2.5 text-sm font-semibold text-slate-600 group-hover:text-slate-800">
                                        Show Password
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                Login to Portal
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" /></svg>
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
