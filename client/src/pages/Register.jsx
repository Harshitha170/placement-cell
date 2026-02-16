import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    // Clear error/success after 10 seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                if (success) {
                    // Actual redirect for success happens here if timeout finishes
                    const routes = {
                        student: '/student/dashboard',
                        recruiter: '/recruiter/dashboard',
                        admin: '/admin/dashboard'
                    };
                    const savedUser = JSON.parse(localStorage.getItem('user'));
                    navigate(routes[savedUser?.role] || '/');
                }
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [error, success, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleChange = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            setSuccess('Account registered successfully! Redirecting to your dashboard in 10 seconds...');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setLoading(false);
        }
    };

    const roles = [
        {
            id: 'student',
            title: 'Student',
            icon: '🎓',
            color: 'blue',
            styles: {
                logo: 'bg-blue-600',
                text: 'text-blue-600',
                bgLight: 'bg-blue-50',
                border: 'border-blue-400',
                focus: 'focus:border-blue-400',
                button: 'bg-blue-500 hover:bg-blue-600',
                link: 'text-blue-400 hover:text-blue-600',
                gradient: 'from-blue-900/80',
                accentText: 'text-blue-200'
            }
        },
        {
            id: 'recruiter',
            title: 'Recruiter',
            icon: '💼',
            color: 'indigo',
            styles: {
                logo: 'bg-indigo-600',
                text: 'text-indigo-600',
                bgLight: 'bg-indigo-50',
                border: 'border-indigo-400',
                focus: 'focus:border-indigo-400',
                button: 'bg-indigo-500 hover:bg-indigo-600',
                link: 'text-indigo-400 hover:text-indigo-600',
                gradient: 'from-indigo-900/80',
                accentText: 'text-indigo-200'
            }
        },
        {
            id: 'admin',
            title: 'Admin',
            icon: 'shield',
            color: 'purple',
            styles: {
                logo: 'bg-purple-600',
                text: 'text-purple-600',
                bgLight: 'bg-purple-50',
                border: 'border-purple-400',
                focus: 'focus:border-purple-400',
                button: 'bg-purple-500 hover:bg-purple-600',
                link: 'text-purple-400 hover:text-purple-600',
                gradient: 'from-purple-900/80',
                accentText: 'text-purple-200'
            }
        }
    ];

    const currentRoleData = roles.find(r => r.id === formData.role);

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side: Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-8 sm:px-12 lg:px-24 xl:px-32">
                <div className="mx-auto w-full max-w-sm lg:w-[480px]">
                    <div className="mb-10">
                        <Link to="/" className="inline-flex items-center gap-3 mb-8">
                            <div className={`w-10 h-10 ${currentRoleData.styles.logo} rounded-xl flex items-center justify-center text-white font-black text-xl transition-colors duration-500`}>CB</div>
                            <span className={`text-2xl font-black ${currentRoleData.styles.text} tracking-tighter transition-colors duration-500`}>Career Bridge</span>
                        </Link>
                        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h2>
                        <p className="text-slate-400 font-medium">Join the next generation of professionals.</p>
                    </div>

                    {error && (
                        <div key={error} className="relative mb-8 p-5 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 animate-shake overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-sm font-bold">{error}</span>
                            <div className="absolute bottom-0 left-0 h-1 bg-rose-200 w-full">
                                <div className="h-full bg-rose-500" style={{ animation: 'shrink 10s linear forwards' }} />
                            </div>
                        </div>
                    )}

                    {success && (
                        <div key={success} className="relative mb-8 p-5 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-bold">{success}</span>
                            <div className="absolute bottom-0 left-0 h-1 bg-emerald-200 w-full">
                                <div className="h-full bg-emerald-500" style={{ animation: 'shrink 10s linear forwards' }} />
                            </div>
                            <button
                                onClick={() => {
                                    const routes = {
                                        student: '/student/dashboard',
                                        recruiter: '/recruiter/dashboard',
                                        admin: '/admin/dashboard'
                                    };
                                    const savedUser = JSON.parse(localStorage.getItem('user'));
                                    navigate(routes[savedUser?.role] || '/');
                                }}
                                className="ml-auto text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1 rounded-full hover:bg-emerald-600 transition-colors"
                            >
                                Skip Wait
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div className="space-y-3">
                            <label className="block text-xs font-black text-slate-300 uppercase tracking-widest px-1">Selected Role</label>
                            <div className="grid grid-cols-3 gap-3">
                                {roles.map((r) => (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => handleRoleChange(r.id)}
                                        disabled={!!success}
                                        className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-500 ${formData.role === r.id
                                            ? `${r.styles.border} ${r.styles.bgLight} ${r.styles.text} shadow-lg scale-105`
                                            : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                                            } ${!!success ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <span className={`text-xl mb-1 transition-transform duration-500 ${formData.role === r.id ? 'scale-125' : ''}`}>{r.id === 'admin' ? '🛡️' : r.icon}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${formData.role === r.id ? r.styles.text : 'text-slate-400'}`}>
                                            {r.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    disabled={!!success}
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none ${currentRoleData.styles.focus} transition-all font-medium disabled:opacity-50`}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    disabled={!!success}
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none ${currentRoleData.styles.focus} transition-all font-medium disabled:opacity-50`}
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        disabled={!!success}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none ${currentRoleData.styles.focus} transition-all font-medium disabled:opacity-50`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm</label>
                                    <input
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        disabled={!!success}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none ${currentRoleData.styles.focus} transition-all font-medium disabled:opacity-50`}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !!success}
                            className={`w-full py-5 ${currentRoleData.styles.button} text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-2xl transition-all duration-300 disabled:opacity-50`}
                        >
                            {success ? 'Success!' : (loading ? 'Processing...' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                            Already a member?{' '}
                            <Link to="/login" className={`${currentRoleData.styles.link} underline underline-offset-8 transition-colors`}>
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Visual Section */}
            <div className={`hidden lg:block relative w-[38%] ${currentRoleData.styles.logo} overflow-hidden transition-colors duration-700`}>
                <img
                    className="absolute inset-0 h-full w-full object-cover opacity-90 shadow-2xl"
                    src="/images/career_student_real.png"
                    alt="Career Success"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
                <div className="absolute bottom-16 right-16 left-16 text-right">
                    <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tight">Access Exclusive <span className="text-white/90">Opportunities</span>.</h2>
                </div>
            </div>
        </div>
    );
};

export default Register;
