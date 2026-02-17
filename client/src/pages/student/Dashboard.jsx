import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ResumeUpload from '../../components/student/ResumeUpload';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ applications: 0, interviews: 0 });
    const [recentJobs, setRecentJobs] = useState([]);
    const [matchingJobs, setMatchingJobs] = useState([]);
    const [skillsFound, setSkillsFound] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        fetchLatestAnalysis();
    }, []);

    const fetchLatestAnalysis = async () => {
        try {
            const res = await api.get('/resume/analysis/latest');
            if (res.data && res.data.skills) {
                setSkillsFound(res.data.skills);
                fetchMatchingJobs(res.data.skills);
            }
        } catch (error) {
            console.log('No resume analysis found yet');
        }
    };

    const fetchMatchingJobs = async (skills) => {
        if (!skills || skills.length === 0) return;
        try {
            // Take top 3 skills for matching to avoid overly narrow results
            const searchTerms = skills.slice(0, 3).join(' ');
            const res = await api.get(`/jobs?search=${encodeURIComponent(searchTerms)}`);
            setMatchingJobs(res.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching matching jobs:', error);
        }
    };

    const handleUploadSuccess = (analysis) => {
        if (analysis.skills) {
            setSkillsFound(analysis.skills);
            fetchMatchingJobs(analysis.skills);
        }
    };

    const fetchDashboardData = async () => {
        try {
            const [jobsRes, appsRes, interviewsRes] = await Promise.all([
                api.get('/jobs?limit=5'),
                api.get('/applications/my-applications'),
                api.get('/interviews/my-interviews')
            ]);

            setRecentJobs(jobsRes.data.slice(0, 5));
            setStats({
                applications: appsRes.data.length,
                interviews: interviewsRes.data.length
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-primary-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#fcfdfe] overflow-hidden">
            {/* Unified Professional Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-50/30 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-cyan-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-primary-100">
                            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse"></span>
                            Portal Live
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2 underline decoration-primary-400 decoration-8 underline-offset-8">My career hub</h1>
                        <p className="text-slate-500 font-medium text-lg italic">Welcome back! Path to your dream career starts here.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="group relative bg-white p-8 rounded-[3rem] border border-primary-100 shadow-premium hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:rotate-6 transition-all duration-300">📝</div>
                            <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
                        </div>
                        <h3 className="text-slate-400 font-black text-xs uppercase tracking-widest mb-1 relative z-10">Total Applications</h3>
                        <p className="text-5xl font-black text-slate-900 relative z-10">{stats.applications}</p>
                        <div className="mt-6 h-2 w-full bg-slate-100 rounded-full overflow-hidden relative z-10">
                            <div className="h-full bg-primary-400 rounded-full transition-all duration-1000 ease-out" style={{ width: stats.applications > 0 ? '70%' : '0%' }}></div>
                        </div>
                    </div>

                    <div className="group relative bg-white p-8 rounded-[3rem] border border-primary-100 shadow-premium hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:rotate-6 transition-all duration-300">📅</div>
                            <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-widest">Scheduled</span>
                        </div>
                        <h3 className="text-slate-400 font-black text-xs uppercase tracking-widest mb-1 relative z-10">Upcoming Interviews</h3>
                        <p className="text-5xl font-black text-slate-900 relative z-10">{stats.interviews}</p>
                        <div className="mt-6 h-2 w-full bg-slate-100 rounded-full overflow-hidden relative z-10">
                            <div className="h-full bg-primary-600 rounded-full transition-all duration-1000 ease-out" style={{ width: stats.interviews > 0 ? '40%' : '0%' }}></div>
                        </div>
                    </div>

                    <div className="group relative bg-primary-900 p-8 rounded-[3rem] shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-400/20 rounded-full -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-700 blur-2xl"></div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center text-3xl backdrop-blur-md group-hover:rotate-12 transition-all duration-300">👤</div>
                            <span className="text-[10px] font-black text-primary-300 bg-primary-400/20 px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">Verified</span>
                        </div>
                        <h3 className="text-primary-300/60 font-black text-xs uppercase tracking-widest mb-1 relative z-10">Account Type</h3>
                        <p className="text-5xl font-black text-white relative z-10 uppercase tracking-tighter">Student</p>
                        <p className="text-primary-400 text-[10px] font-black uppercase tracking-widest mt-4 relative z-10 italic">{user?.name}</p>
                    </div>
                </div>

                {/* Resume Intelligence Section */}
                <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ResumeUpload onUploadSuccess={handleUploadSuccess} />

                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] border border-primary-100 shadow-premium relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center text-2xl">🧠</div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Skill Profile</h3>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Extracted from your resume</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {skillsFound.length > 0 ? (
                                    skillsFound.map((skill, i) => (
                                        <span key={i} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <div className="w-full py-8 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No Intelligence Uploaded Yet</p>
                                    </div>
                                )}
                            </div>

                            {skillsFound.length > 0 && (
                                <p className="mt-6 text-[10px] font-bold text-slate-400 italic">
                                    * These skills are currently driving your personalized job matches.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-10">
                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-primary-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group h-full">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-400/10 rounded-full -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-400/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-1000 blur-3xl"></div>

                            <h2 className="text-2xl font-black mb-8 relative z-10 uppercase tracking-tighter italic text-primary-100">Command Center</h2>
                            <div className="space-y-4 relative z-10">
                                <Link to="/student/jobs" className="flex items-center gap-4 p-5 bg-white/5 hover:bg-primary-400/20 rounded-3xl border border-white/5 transition-all group/item hover:translate-x-2">
                                    <div className="w-10 h-10 bg-primary-400/20 rounded-xl flex items-center justify-center text-xl">🔍</div>
                                    <span className="font-bold flex-1 text-sm uppercase tracking-widest">Marketplace</span>
                                    <span className="opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-10px] group-hover/item:translate-x-0">→</span>
                                </Link>
                                <Link to="/student/ats-scanner" className="flex items-center gap-4 p-5 bg-white/5 hover:bg-primary-400/20 rounded-3xl border border-white/5 transition-all group/item hover:translate-x-2">
                                    <div className="w-10 h-10 bg-primary-400/20 rounded-xl flex items-center justify-center text-xl">📄</div>
                                    <span className="font-bold flex-1 text-sm uppercase tracking-widest">ATS Pro</span>
                                    <span className="opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-10px] group-hover/item:translate-x-0">→</span>
                                </Link>
                                <Link to="/student/mock-interview" className="flex items-center gap-4 p-5 bg-white/5 hover:bg-primary-400/20 rounded-3xl border border-white/5 transition-all group/item hover:translate-x-2">
                                    <div className="w-10 h-10 bg-primary-400/20 rounded-xl flex items-center justify-center text-xl">🤖</div>
                                    <span className="font-bold flex-1 text-sm uppercase tracking-widest">AI Labs</span>
                                    <span className="opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-10px] group-hover/item:translate-x-0">→</span>
                                </Link>
                                <Link to="/student/courses" className="flex items-center gap-4 p-5 bg-white/5 hover:bg-primary-400/20 rounded-3xl border border-white/5 transition-all group/item hover:translate-x-2">
                                    <div className="w-10 h-10 bg-primary-400/20 rounded-xl flex items-center justify-center text-xl">📚</div>
                                    <span className="font-bold flex-1 text-sm uppercase tracking-widest">Learning Vault</span>
                                    <span className="opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-10px] group-hover/item:translate-x-0">→</span>
                                </Link>
                                <Link to="/profile" className="flex items-center gap-4 p-5 bg-white/5 hover:bg-primary-400/20 rounded-3xl border border-white/5 transition-all group/item hover:translate-x-2">
                                    <div className="w-10 h-10 bg-primary-400/20 rounded-xl flex items-center justify-center text-xl">👤</div>
                                    <span className="font-bold flex-1 text-sm uppercase tracking-widest">Identity</span>
                                    <span className="opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-10px] group-hover/item:translate-x-0">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Jobs */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] border-2 border-slate-50 shadow-premium h-full">
                            <div className="flex justify-between items-end mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
                                        {skillsFound.length > 0 ? 'Intelligent Matches' : 'Curated Matches'}
                                    </h2>
                                    <p className="text-slate-400 font-medium italic">
                                        {skillsFound.length > 0 ? 'AI-filtered based on your unique skill profile.' : 'High-potential opportunities updated hourly.'}
                                    </p>
                                </div>
                                <Link to="/student/jobs" className="px-6 py-2 bg-primary-100 text-primary-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all">
                                    Full Marketplace
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {(skillsFound.length > 0 && matchingJobs.length > 0 ? matchingJobs : recentJobs).length > 0 ? (
                                    (skillsFound.length > 0 && matchingJobs.length > 0 ? matchingJobs : recentJobs).map((job) => (
                                        <div key={job._id} className="group flex items-center gap-6 p-6 bg-slate-50/50 rounded-[2rem] border-2 border-transparent hover:border-primary-200 hover:bg-white hover:shadow-xl transition-all duration-500">
                                            <div className="w-20 h-20 bg-gradient-to-br from-white to-slate-50 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-sm border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                                {job.company?.[0] || '🏢'}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-black text-xl text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <p className="text-slate-500 font-bold text-sm italic">{job.company}</p>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{job.location}</span>
                                                </div>
                                            </div>
                                            <div className="hidden sm:flex flex-col items-end gap-3">
                                                <span className="px-4 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">{job.jobType}</span>
                                                <div className="flex gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                                    <span className="w-2 h-2 rounded-full bg-primary-400"></span>
                                                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                                                </div>
                                            </div>
                                            <Link to={`/student/jobs`} className="w-14 h-14 flex items-center justify-center bg-white text-slate-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-900 hover:text-white shadow-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                        <div className="text-7xl mb-6 grayscale opacity-30">🔭</div>
                                        <h3 className="font-black text-slate-400 uppercase text-xs tracking-[0.3em] mb-2">Scanning for matches</h3>
                                        <p className="text-slate-300 text-sm font-medium italic">Your personalized feed is being generated...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
