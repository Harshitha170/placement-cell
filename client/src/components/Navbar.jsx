import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3 group-hover:rotate-12 transition-transform duration-300">CB</div>
                            <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">Career Bridge</span>
                        </Link>

                        {user && (
                            <div className="hidden md:ml-10 md:flex md:items-center md:space-x-1">
                                {user.role === 'student' && (
                                    <>
                                        <Link to="/student/dashboard" className="nav-link">Dashboard</Link>
                                        <Link to="/student/jobs" className="nav-link">Jobs</Link>
                                        <Link to="/student/applications" className="nav-link">Applied</Link>
                                        <Link to="/student/interviews" className="nav-link">Interviews</Link>

                                        {/* Dropdown or More Menu could go here, for now keeping essential ones */}
                                        <div className="h-4 w-px bg-gray-200 mx-2"></div>

                                        <Link to="/student/mock-interview" className="nav-link text-indigo-600 font-semibold">AI Interview</Link>
                                        <Link to="/student/courses" className="nav-link">Courses</Link>
                                    </>
                                )}

                                {user.role === 'recruiter' && (
                                    <>
                                        <Link to="/recruiter/dashboard" className="nav-link">Dashboard</Link>
                                        <Link to="/recruiter/post-job" className="nav-link">Post Job</Link>
                                        <Link to="/recruiter/interviews" className="nav-link">Interviews</Link>
                                    </>
                                )}

                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                                        <Link to="/admin/users" className="nav-link">Users</Link>
                                        <Link to="/admin/prep-notes" className="nav-link">Prep Notes</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <Link to="/profile" className="flex items-center space-x-3 group">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">{user.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-white shadow-md group-hover:scale-110 transition-transform">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                                    title="Logout"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="px-5 py-2 text-sm font-bold text-gray-700 hover:text-primary-600 transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-primary py-2 shadow-none">
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
