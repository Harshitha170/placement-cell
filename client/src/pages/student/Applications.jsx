import { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications/my-applications');
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        const config = {
            applied: {
                bg: 'bg-primary-50',
                text: 'text-primary-600',
                border: 'border-primary-100',
                label: 'Under Review'
            },
            shortlisted: {
                bg: 'bg-amber-50',
                text: 'text-amber-600',
                border: 'border-amber-100',
                label: 'Shortlisted'
            },
            interview_scheduled: {
                bg: 'bg-indigo-50',
                text: 'text-indigo-600',
                border: 'border-indigo-100',
                label: 'Interviewing'
            },
            rejected: {
                bg: 'bg-rose-50',
                text: 'text-rose-600',
                border: 'border-rose-100',
                label: 'Rejected'
            },
            hired: {
                bg: 'bg-emerald-50',
                text: 'text-emerald-600',
                border: 'border-emerald-100',
                label: 'Hired'
            }
        };
        return config[status] || config.applied;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Tracing Success</h1>
                    <p className="text-slate-500 font-medium italic">Your professional journey, mapped and tracked.</p>
                </div>
                <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
                        <p className="text-xl font-black text-slate-900 leading-none">{applications.length}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active</p>
                        <p className="text-xl font-black text-primary-500 leading-none">
                            {applications.filter(a => !['rejected', 'hired'].includes(a.status)).length}
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Retrieving Data</p>
                </div>
            ) : applications.length > 0 ? (
                <div className="grid gap-6">
                    {applications.map((app) => {
                        const style = getStatusStyles(app.status);
                        return (
                            <div key={app._id} className="group relative bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-500 overflow-hidden">
                                {/* Status Chip - Absolute */}
                                <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-3xl border-l-2 border-b-2 font-black uppercase text-[10px] tracking-widest ${style.bg} ${style.text} ${style.border}`}>
                                    {style.label}
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-8">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl shadow-inner border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                        {app.jobId?.company?.[0] || '🏢'}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                            {app.jobId?.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-slate-400 font-bold text-sm">
                                            <span className="flex items-center gap-1">💼 {app.jobId?.company}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <span className="flex items-center gap-1">📅 Applied on {new Date(app.appliedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all border border-slate-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <div className="h-10 w-px bg-slate-100"></div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Last Update</p>
                                            <p className="text-xs font-bold text-slate-500">2 days ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 py-32 text-center">
                    <div className="text-8xl mb-6 grayscale h-24 flex items-center justify-center">🏹</div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">No active hunt</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">You haven't applied to any roles yet. Start exploring the marketplace to bridge your career.</p>
                    <Link to="/student/jobs" className="inline-block mt-8 px-10 py-4 bg-primary-400 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-200">
                        Explore Jobs
                    </Link>
                </div>
            )}
        </div>
    );
};

export default StudentApplications;
