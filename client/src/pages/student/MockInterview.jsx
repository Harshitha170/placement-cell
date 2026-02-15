import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const MockInterview = () => {
    const navigate = useNavigate();
    const [mockInterviews, setMockInterviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showStartModal, setShowStartModal] = useState(false);
    const [formData, setFormData] = useState({
        jobRole: 'Software Engineer',
        difficulty: 'Medium',
        category: 'Technical'
    });

    useEffect(() => {
        fetchMockInterviews();
        fetchStats();
    }, []);

    const fetchMockInterviews = async () => {
        try {
            const response = await api.get('/mock-interviews/my-interviews');
            setMockInterviews(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching mock interviews:', error);
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/mock-interviews/stats/overview');
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDeleteInterview = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this interview session? This action cannot be undone.')) {
            try {
                await api.delete(`/mock-interviews/${id}`);
                setMockInterviews(prev => prev.filter(interview => interview._id !== id));
                fetchStats(); // Update stats after deletion
            } catch (error) {
                console.error('Error deleting mock interview:', error);
                alert('Failed to delete session');
            }
        }
    };

    const handleStartInterview = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/mock-interviews/start', formData);
            navigate(`/student/mock-interview/${response.data.data._id}`);
        } catch (error) {
            console.error('Error starting mock interview:', error);
            alert('Failed to start mock interview');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Completed': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
            case 'In Progress': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' };
            default: return { bg: 'bg-slate-50', text: 'text-slate-400', border: 'border-slate-100' };
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-rose-500';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">AI Assessment Lab</h1>
                    <p className="text-slate-500 font-medium italic">Simulate real-world challenges with our elite AI engine.</p>
                </div>
                <button
                    onClick={() => setShowStartModal(true)}
                    className="px-8 py-4 bg-primary-400 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-200/50 transform hover:-translate-y-1 flex items-center gap-3"
                >
                    <span className="text-xl">➕</span>
                    Initiate Mock Session
                </button>
            </div>

            {/* Stats Dashboard */}
            {stats && stats.totalMocks > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 shadow-sm flex flex-col items-center justify-center text-center group hover:border-primary-100 transition-all">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Total Iterations</p>
                        <p className="text-4xl font-black text-slate-900 group-hover:text-primary-600 transition-colors">{stats.totalMocks}</p>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 shadow-sm flex flex-col items-center justify-center text-center group hover:border-primary-100 transition-all">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Aggregate Score</p>
                        <p className={`text-4xl font-black ${getScoreColor(stats.avgScore)} group-hover:scale-110 transition-transform`}>{stats.avgScore}%</p>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 shadow-sm flex flex-col items-center justify-center text-center group hover:border-primary-100 transition-all">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Personal Best</p>
                        <p className="text-4xl font-black text-emerald-500">{stats.bestScore}%</p>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 shadow-sm flex flex-col items-center justify-center text-center group hover:border-primary-100 transition-all overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary-50 rounded-bl-[2rem] -mr-8 -mt-8"></div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Growth Rate</p>
                        <p className="text-4xl font-black text-primary-500">
                            {stats.improvementRate > 0 ? '+' : ''}{stats.improvementRate}%
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-premium p-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-primary-400 rounded-full"></div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Session Log</h2>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : mockInterviews.length === 0 ? (
                    <div className="py-24 text-center group">
                        <div className="text-8xl mb-8 group-hover:rotate-12 transition-transform duration-500">🎙️</div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">No Recorded Sessions</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10">Your journey to mastery begins with your first AI-guided assessment.</p>
                        <button
                            onClick={() => setShowStartModal(true)}
                            className="inline-block px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-500 hover:shadow-2xl transition-all"
                        >
                            Launch First Session
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {mockInterviews.map(interview => (
                            <div
                                key={interview._id}
                                onClick={() => interview.status === 'Completed' && navigate(`/student/mock-interview/${interview._id}`)}
                                className={`group p-8 rounded-[2.5rem] border-2 border-slate-50 hover:border-primary-100 transition-all duration-500 ${interview.status === 'Completed' ? 'cursor-pointer hover:bg-slate-50/50' : 'cursor-default'}`}
                            >
                                <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                                                {interview.jobRole}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(interview.status).bg} ${getStatusStyles(interview.status).text} ${getStatusStyles(interview.status).border}`}>
                                                {interview.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span className="flex items-center gap-1">🏷️ {interview.category}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full my-auto"></span>
                                            <span className="flex items-center gap-1">📊 {interview.difficulty}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full my-auto"></span>
                                            <span className="flex items-center gap-1">📅 {new Date(interview.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {interview.status === 'Completed' ? (
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Performance</p>
                                                <p className={`text-4xl font-black ${getScoreColor(interview.overallScore)}`}>
                                                    {interview.overallScore}%
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteInterview(e, interview._id)}
                                                className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Delete Session"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                            <div className="p-4 bg-white text-slate-400 rounded-2xl border border-slate-100 group-hover:text-primary-500 group-hover:bg-primary-50 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/student/mock-interview/${interview._id}`); }}
                                                className="px-6 py-4 bg-amber-400 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 transition-all shadow-lg shadow-amber-100"
                                            >
                                                Resume Session
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteInterview(e, interview._id)}
                                                className="p-4 border-2 border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 rounded-2xl transition-all"
                                                title="Cancel & Delete Session"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Config Modal */}
            {showStartModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
                        <div className="bg-slate-900 p-10 text-white">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-4xl font-black uppercase tracking-tight">Configuration</h2>
                                <button onClick={() => setShowStartModal(false)} className="text-4xl font-extralight hover:text-primary-400 transition-colors">×</button>
                            </div>
                            <p className="text-slate-400 font-medium italic">Define the parameters for your AI simulation.</p>
                        </div>

                        <form onSubmit={handleStartInterview} className="p-10 space-y-8">
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Target Expertise</label>
                                <select
                                    value={formData.jobRole}
                                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-primary-400 font-bold text-sm"
                                >
                                    <option value="Software Engineer">Software Engineer</option>
                                    <option value="Data Scientist">Data Scientist</option>
                                    <option value="Frontend Developer">Frontend Developer</option>
                                    <option value="Backend Developer">Backend Developer</option>
                                    <option value="Full Stack Developer">Full Stack Developer</option>
                                    <option value="DevOps Engineer">DevOps Engineer</option>
                                    <option value="Product Manager">Product Manager</option>
                                    <option value="Other">Custom Track</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Evaluation Stream</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Technical', 'HR', 'Behavioral', 'Mixed'].map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={`p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.category === cat ? 'border-primary-400 bg-primary-50 text-primary-600' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Intensity Level</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Easy', 'Medium', 'Hard'].map(level => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, difficulty: level })}
                                            className={`p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.difficulty === level ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-6 bg-primary-400 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-primary-500 shadow-2xl shadow-primary-200 transition-all transform hover:-translate-y-1"
                            >
                                Launch Simulation
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MockInterview;
