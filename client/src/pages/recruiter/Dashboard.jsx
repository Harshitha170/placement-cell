import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const RecruiterDashboard = () => {
    const [stats, setStats] = useState({ jobs: 0, applications: 0, interviews: 0 });
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/jobs/recruiter/my-jobs');
            setMyJobs(response.data);

            // Get total applications across all jobs and scheduled interviews
            // In a real app, these would come from separate stats endpoints
            setStats({
                jobs: response.data.length,
                applications: response.data.reduce((acc, job) => acc + (job.applicantCount || 0), 0),
                interviews: 0 // Placeholder
            });

            // Fetch interviews count separately if needed
            const interviewsRes = await api.get('/interviews/recruiter/scheduled');
            setStats(prev => ({ ...prev, interviews: interviewsRes.data.length }));

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Assembling Ops Center</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase italic underline decoration-primary-400 decoration-8 underline-offset-8">Recruitment ops</h1>
                    <p className="text-slate-500 font-medium italic">Command center for organizational talent acquisition.</p>
                </div>
                <Link
                    to="/recruiter/post-job"
                    className="px-8 py-4 bg-primary-400 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-200/50 transform hover:-translate-y-1 flex items-center gap-3"
                >
                    <span className="text-xl">🚀</span> Post New Job
                </Link>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col items-center justify-center text-center group hover:border-primary-100 hover:shadow-2xl transition-all duration-500">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Live Postings</p>
                    <p className="text-5xl font-black text-slate-900 group-hover:text-primary-600 transition-colors">{stats.jobs}</p>
                    {stats.jobs > 0 && (
                        <div className="mt-4 h-1.5 w-24 bg-primary-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col items-center justify-center text-center group hover:border-indigo-100 hover:shadow-2xl transition-all duration-500">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Total Applications</p>
                    <p className="text-5xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{stats.applications}</p>
                    {stats.applications > 0 && (
                        <div className="mt-4 h-1.5 w-24 bg-indigo-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col items-center justify-center text-center group hover:border-emerald-100 hover:shadow-2xl transition-all duration-500">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Scheduled Interviews</p>
                    <p className="text-5xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{stats.interviews}</p>
                    {stats.interviews > 0 && (
                        <div className="mt-4 h-1.5 w-24 bg-emerald-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Job Table */}
            <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-premium p-10">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-primary-400 rounded-full"></div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active Job Postings</h2>
                    </div>
                    <Link to="/recruiter/interviews" className="text-xs font-black text-primary-500 uppercase tracking-widest hover:text-primary-600 underline underline-offset-8">
                        View Schedule →
                    </Link>
                </div>

                <div className="space-y-6">
                    {myJobs.length > 0 ? (
                        myJobs.map((job) => (
                            <div key={job._id} className="group relative bg-slate-50/50 p-8 rounded-[2.5rem] border-2 border-transparent hover:border-primary-100 hover:bg-white transition-all duration-500 overflow-hidden">
                                <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                                    <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner border border-slate-100 group-hover:scale-105 transition-all duration-500">
                                        🏢
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors">{job.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${job.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm italic">Company: {job.company} • Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Applications</p>
                                            <p className="text-xl font-black text-slate-900">{job.applicantCount || 0}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Link
                                                to={`/recruiter/job/${job._id}/applicants`}
                                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-slate-200 text-center"
                                            >
                                                View Applicants
                                            </Link>
                                            <Link
                                                to={`/recruiter/edit-job/${job._id}`}
                                                className="px-8 py-3 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all text-center border border-transparent hover:border-blue-100"
                                            >
                                                Edit Job
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-24 text-center group">
                            <div className="text-8xl mb-8 group-hover:-rotate-12 transition-transform duration-500">📫</div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">No Active Deployments</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10">Expand your organization's reach by posting your first job opportunity.</p>
                            <Link to="/recruiter/post-job" className="inline-block px-10 py-5 bg-primary-400 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-500 hover:shadow-2xl transition-all">
                                Post First Job
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
