import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const RecruiterApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        fetchAllApplications();
    }, []);

    const fetchAllApplications = async () => {
        try {
            setError(null);
            const response = await api.get('/applications/recruiter/all');
            setApplications(response.data);
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'Failed to retrieve applications');
        } finally {
            setLoading(false);
        }
    };

    const getAssetUrl = (path) => {
        if (!path) return null;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const serverUrl = baseUrl.replace('/api', '');
        return `${serverUrl}${path}`;
    };

    const updateStatus = async (applicationId, newStatus) => {
        try {
            await api.put(`/applications/${applicationId}/status`, { status: newStatus });
            alert('Status updated successfully!');
            fetchAllApplications();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update status');
        }
    };

    const getStatusStyles = (status) => {
        const config = {
            applied: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-100', label: 'Under Review' },
            shortlisted: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', label: 'Shortlisted' },
            interview_scheduled: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', label: 'Interviewing' },
            hired: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Hired' },
            rejected: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', label: 'Rejected' },
        };
        return config[status] || config.applied;
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Applications</p>
        </div>
    );

    if (error) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">{error}</h2>
            <button
                onClick={fetchAllApplications}
                className="px-8 py-4 bg-primary-400 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-500 transition-all shadow-xl"
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="mb-12">
                <Link to="/recruiter/dashboard" className="inline-flex items-center text-primary-600 font-black text-[10px] uppercase tracking-widest hover:text-primary-700 transition-all mb-6 group">
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Hub Overview
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase italic underline decoration-primary-400 decoration-8 underline-offset-8">All Applications</h1>
                        <p className="text-slate-500 font-medium italic">View all students who have applied to your jobs.</p>
                    </div>
                    <div className="flex items-center gap-6 px-6 py-4 bg-slate-900 rounded-[2rem] text-white shadow-2xl">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total</p>
                            <p className="text-2xl font-black">{applications.length}</p>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Shortlisted</p>
                            <p className="text-2xl font-black text-primary-400">{applications.filter(a => a.status === 'shortlisted').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 py-32 text-center">
                    <div className="text-8xl mb-6 grayscale">📭</div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">No Applications Yet</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">Once candidates apply to your job postings, they will appear here for evaluation.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app) => {
                        const style = getStatusStyles(app.status);
                        return (
                            <div key={app._id} className="group relative bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm hover:shadow-3xl hover:border-primary-100 transition-all duration-500 overflow-hidden">
                                <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-3xl border-l-2 border-b-2 font-black uppercase text-[10px] tracking-widest ${style.bg} ${style.text} ${style.border}`}>
                                    {style.label}
                                </div>

                                <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                                    <div className="w-20 h-20 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center text-4xl font-black shadow-lg group-hover:scale-105 transition-transform duration-500">
                                        {app.studentId?.name?.[0] || 'A'}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                                                {app.studentId?.name}
                                            </h3>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mx-2">•</span>
                                            <span className="text-xs font-black text-primary-500 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full">{app.jobId?.title}</span>
                                        </div>
                                        <p className="text-slate-500 font-bold text-sm mb-4 flex items-center gap-2">
                                            <span>📧 {app.studentId?.email}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full mx-1"></span>
                                            <span>📅 {new Date(app.appliedAt).toLocaleDateString()}</span>
                                        </p>

                                        {app.studentId?.studentProfile && (
                                            <div className="flex flex-wrap gap-2">
                                                {app.studentId.studentProfile.skills?.slice(0, 4).map((skill, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap lg:flex-col gap-3 min-w-[200px]">
                                        <button
                                            onClick={() => setSelectedApp(app)}
                                            className="flex-1 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            🔍 View Profile
                                        </button>
                                        {app.resumeUrl && (
                                            <a
                                                href={getAssetUrl(app.resumeUrl)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-6 py-3 bg-emerald-50 text-emerald-600 border-2 border-emerald-100 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                                            >
                                                📄 Resume
                                            </a>
                                        )}
                                        <div className="relative group/sel flex-1">
                                            <select
                                                value={app.status}
                                                onChange={(e) => updateStatus(app._id, e.target.value)}
                                                className="w-full px-6 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400"
                                            >
                                                <option value="applied">Under Review</option>
                                                <option value="shortlisted">Shortlist</option>
                                                <option value="interview_scheduled">Interviewing</option>
                                                <option value="hired">Hired</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-xs">▼</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Application Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
                        <div className="bg-slate-900 p-10 text-white relative">
                            <button onClick={() => setSelectedApp(null)} className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-2xl font-light">×</button>
                            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Student Profile</h2>
                            <p className="text-slate-400 font-medium italic">Reviewing <span className="text-primary-400 font-bold">{selectedApp.studentId?.name}</span> for {selectedApp.jobId?.title}</p>
                        </div>

                        <div className="p-10 overflow-y-auto max-h-[calc(90vh-200px)] space-y-10">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pb-10 border-b border-slate-100">
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Role Objective</p>
                                    <p className="font-black text-slate-900 uppercase text-sm">{selectedApp.jobId?.title}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Academic CGPA</p>
                                    <p className="font-black text-primary-500 text-xl">{selectedApp.studentId?.studentProfile?.cgpa || '8.5'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Graduation</p>
                                    <p className="font-black text-slate-900 uppercase text-sm">{selectedApp.studentId?.studentProfile?.graduationYear || '2025'}</p>
                                </div>
                            </div>

                            {selectedApp.coverLetter && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-indigo-400 rounded-full"></span> Pitch Statement
                                    </h4>
                                    <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100 italic font-medium text-slate-600 leading-relaxed">
                                        {selectedApp.coverLetter}
                                    </div>
                                </div>
                            )}

                            {selectedApp.resumeUrl && (
                                <div className="bg-emerald-50 p-8 rounded-[2.5rem] border-2 border-emerald-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-black text-emerald-900 uppercase text-xs tracking-widest mb-1">Candidate Resume</h4>
                                        <p className="text-emerald-600 text-[10px] font-bold">PDF Format • Secure Access</p>
                                    </div>
                                    <a
                                        href={getAssetUrl(selectedApp.resumeUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg"
                                    >
                                        📄 Open Document
                                    </a>
                                </div>
                            )}

                            <div className="flex gap-4 pt-10 border-t border-slate-100">
                                <Link
                                    to={`/recruiter/schedule-interview/${selectedApp._id}`}
                                    className="flex-[2] py-5 bg-indigo-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest text-center shadow-xl"
                                >
                                    Initiate Interview
                                </Link>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterApplications;
