import { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());

    useEffect(() => {
        fetchData();
    }, [search]);

    const fetchData = async () => {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                api.get(`/jobs?search=${search}`),
                api.get('/applications/my-applications')
            ]);
            setJobs(jobsRes.data);

            const appliedIds = new Set(appsRes.data.map(app => {
                return typeof app.jobId === 'object' ? app.jobId._id : app.jobId;
            }));
            setAppliedJobIds(appliedIds);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const openApplicationModal = (job) => {
        setSelectedJob(job);
        setShowModal(true);
        setResumeFile(null);
        setCoverLetter('');
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedJob(null);
        setResumeFile(null);
        setCoverLetter('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF, DOC, or DOCX file');
                e.target.value = '';
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                e.target.value = '';
                return;
            }
            setResumeFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            alert('Please upload your resume');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('jobId', selectedJob._id);
            formData.append('resume', resumeFile);
            formData.append('coverLetter', coverLetter);

            await api.post('/applications', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Application submitted successfully!');
            fetchData();
            closeModal();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to apply');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            {/* Header & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Job Search</h1>
                    <p className="text-slate-500 font-medium italic">Find the right job for you.</p>
                </div>

                <div className="relative group flex-1 max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by company, role, or keywords..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-medium shadow-sm hover:shadow-md"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Filtering Results</p>
                </div>
            ) : (
                <div className="grid gap-8">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div key={job._id} className="group relative bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-500">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Company Branding */}
                                    <div className="flex-shrink-0">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner border border-slate-100 group-hover:bg-primary-50 group-hover:scale-105 transition-all duration-500">
                                            {job.company?.[0] || '🏢'}
                                        </div>
                                    </div>

                                    {/* Job Details */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors">{job.title}</h2>
                                            {job.salary && (
                                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                                    ₹{job.salary.min} - ₹{job.salary.max}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-slate-600 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="text-primary-500">@</span> {job.company}
                                            <span className="w-1 h-1 bg-slate-200 rounded-full mx-1"></span>
                                            <span className="text-slate-400 font-bold normal-case">📍 {job.location}</span>
                                        </p>

                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                                            {job.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {job.skills?.slice(0, 5).map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                    {skill}
                                                </span>
                                            ))}
                                            {job.skills?.length > 5 && (
                                                <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    +{job.skills.length - 5} More
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Area */}
                                    <div className="flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8 min-w-[160px]">
                                        <div className="flex flex-col items-end gap-1 mb-6">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Job Type</span>
                                            <span className="px-3 py-1 bg-white text-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm">{job.jobType}</span>
                                        </div>

                                        {appliedJobIds.has(job._id) ? (
                                            <button
                                                disabled
                                                className="w-full px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-emerald-100 cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Applied
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => openApplicationModal(job)}
                                                className="w-full px-6 py-4 bg-primary-400 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-200/50 hover:shadow-primary-300 transform hover:-translate-y-1"
                                            >
                                                Apply Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="text-8xl mb-6">🌑</div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">No matches found</h3>
                            <p className="text-slate-500 font-medium">Try adjusting your search terms or exploring other opportunities.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Application Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300 p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                        <div className="bg-slate-900 p-10 text-white relative">
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-2xl font-light">×</button>
                            </div>
                            <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">Apply for Job</h2>
                            <p className="text-slate-400 font-medium italic">Applying for <span className="text-primary-400 font-bold">{selectedJob?.title}</span> at {selectedJob?.company}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Professional Resume</label>
                                <div className={`relative group border-2 border-dashed rounded-[2rem] p-8 text-center transition-all ${resumeFile ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 hover:border-primary-200 hover:bg-slate-50'}`}>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        required
                                    />
                                    <div className="space-y-4">
                                        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-sm ${resumeFile ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300'}`}>
                                            {resumeFile ? '📄' : '☁️'}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase text-xs tracking-widest">{resumeFile ? resumeFile.name : 'Click or Drag Resume'}</p>
                                            <p className="text-slate-400 text-[10px] font-bold mt-1">PDF, DOC, DOCX up to 5MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Cover Note (Optional)</label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    rows="5"
                                    placeholder="Briefly explain why you're a standout fit..."
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-3xl focus:outline-none focus:border-primary-400 transition-all font-medium text-sm"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                                    disabled={submitting}
                                >
                                    Review Later
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-5 bg-primary-400 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-200/50 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Submit Application
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentJobs;
