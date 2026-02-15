import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const roles = [
        {
            id: 'student',
            title: 'Student',
            icon: '🎓',
            color: 'emerald',
            styles: {
                bgDark: 'bg-emerald-900',
                bgLight: 'bg-emerald-50',
                text: 'text-emerald-600',
                border: 'border-emerald-400',
                focus: 'focus:border-emerald-400',
                hover: 'hover:text-emerald-400',
                button: 'bg-emerald-600 hover:bg-emerald-700',
                dot: 'bg-emerald-500',
                underline: 'decoration-emerald-600',
                link: 'text-emerald-500 hover:text-emerald-700'
            }
        },
        {
            id: 'recruiter',
            title: 'Recruiter',
            icon: '💼',
            color: 'indigo',
            styles: {
                bgDark: 'bg-indigo-900',
                bgLight: 'bg-indigo-50',
                text: 'text-indigo-600',
                border: 'border-indigo-400',
                focus: 'focus:border-indigo-400',
                hover: 'hover:text-indigo-400',
                button: 'bg-indigo-600 hover:bg-indigo-700',
                dot: 'bg-indigo-500',
                underline: 'decoration-indigo-600',
                link: 'text-indigo-500 hover:text-indigo-700'
            }
        },
        {
            id: 'admin',
            title: 'Admin',
            icon: 'shield',
            color: 'purple',
            styles: {
                bgDark: 'bg-purple-900',
                bgLight: 'bg-purple-50',
                text: 'text-purple-600',
                border: 'border-purple-400',
                focus: 'focus:border-purple-400',
                hover: 'hover:text-purple-400',
                button: 'bg-purple-600 hover:bg-purple-700',
                dot: 'bg-purple-500',
                underline: 'decoration-purple-600',
                link: 'text-purple-500 hover:text-purple-700'
            }
        }
    ];

    const currentRoleData = roles.find(r => r.id === role);

    // Handle Keyboard Arrow Keys for Role Switching
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const currentIndex = roles.findIndex(r => r.id === role);
                let nextIndex;
                if (e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % roles.length;
                } else {
                    nextIndex = (currentIndex - 1 + roles.length) % roles.length;
                }
                setRole(roles[nextIndex].id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [role]);

    // Clear error after 10 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password, role);

            // Redirect based on role
            const routes = {
                student: '/student/dashboard',
                recruiter: '/recruiter/dashboard',
                admin: '/admin/dashboard'
            };
            navigate(routes[user.role] || '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side: Image/Branding Section - Stabilized layout */}
            <div className={`hidden lg:block relative w-[45%] overflow-hidden transition-colors duration-700 ${currentRoleData.styles.bgDark}`}>
                <img
                    className="absolute inset-0 h-full w-full object-cover opacity-90 shadow-2xl"
                    src="/images/login.png"
                    alt="Success"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="absolute top-12 left-12">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 font-black text-2xl shadow-2xl">CB</div>
                        <span className="text-3xl font-black text-white tracking-tighter">Career Bridge</span>
                    </Link>
                </div>

                <div className="absolute bottom-20 left-16 right-16 text-white text-balance">
                    <h2 className="text-6xl font-black mb-6 leading-tight tracking-tight">
                        Elevate Your <span className="text-white/90">Career</span> Today.
                    </h2>
                    <p className="text-xl text-white/90 max-w-md leading-relaxed font-medium">
                        The ultimate platform connecting ambitious talent with world-class opportunities.
                    </p>
                </div>
            </div>

            {/* Right Side: Professional Login Section */}
            <div className="flex-1 flex flex-col justify-center py-12 px-8 sm:px-16 lg:px-24 bg-white shadow-2xl z-10">
                <div className="mx-auto w-full max-w-sm lg:w-[420px]">
                    <div className="mb-12 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-black mb-3 tracking-tight">Welcome Back</h2>
                        <p className="text-black/70 text-lg font-bold">Select your role and login.</p>
                    </div>

                    {error && (
                        <div key={error} className="relative mb-8 p-5 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 animate-shake overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-sm font-bold">{error}</span>

                            {/* 10-Second Visual Progress Bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-rose-200 w-full">
                                <div
                                    className="h-full bg-rose-500"
                                    style={{
                                        animation: 'shrink 10s linear forwards'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Role Selection */}
                        <div className="space-y-4">
                            <div className="px-1">
                                <label className="text-xs font-black text-black uppercase tracking-widest">Select Role</label>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {roles.map((r) => (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => setRole(r.id)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${role === r.id
                                            ? `${r.styles.border} ${r.styles.bgLight} ${r.styles.text} shadow-xl scale-105`
                                            : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white'
                                            }`}
                                    >
                                        <span className={`text-2xl mb-1 transition-transform duration-300 ${role === r.id ? 'scale-125 rotate-6' : ''}`}>{r.id === 'admin' ? '🛡️' : r.icon}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${role === r.id ? r.styles.text : 'text-black'}`}>
                                            {r.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>



                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-black uppercase tracking-widest mb-2 px-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`input-field ${currentRoleData.styles.focus} transition-all`}
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <label className="text-xs font-black text-black uppercase tracking-widest">Password</label>
                                </div>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`input-field ${currentRoleData.styles.focus} transition-all`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 ${currentRoleData.styles.hover} transition-colors cursor-pointer`}
                                        title={showPassword ? "Hide Secret" : "View Secret"}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            {showPassword ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Professional Identity Confirmation Box - Bold All Caps */}
                        <div className="p-5 rounded-2xl border-2 border-black bg-slate-50 flex items-center justify-center transition-all duration-500 shadow-sm mb-6">
                            <p className="text-sm font-black text-black uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${currentRoleData.styles.dot} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></span>
                                PROCEED AS <span className={`${currentRoleData.styles.text} underline underline-offset-4 decoration-2`}>{currentRoleData.title}</span>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 text-base tracking-[0.1em] font-black uppercase shadow-2xl transition-all active:scale-95 ${currentRoleData.styles.button} text-white rounded-2xl flex items-center justify-center gap-3`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {loading ? 'AUTHENTICATING...' : 'SECURE LOGIN'}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-sm font-black text-black uppercase tracking-widest">
                            New here?{' '}
                            <Link to="/register" className={`${currentRoleData.styles.link} underline underline-offset-8 transition-colors`}>
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
