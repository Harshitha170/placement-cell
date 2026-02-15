import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const RecruiterPostJob = () => {
    const { jobId } = useParams();
    const isEditMode = !!jobId;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(isEditMode);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        requirements: '',
        skills: '',
        location: '',
        jobType: 'Full-time',
        salaryMin: '',
        salaryMax: '',
        experienceMin: '',
        experienceMax: '',
        deadline: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetchJobDetails();
        }
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            const response = await api.get(`/jobs/${jobId}`);
            const job = response.data;
            setFormData({
                title: job.title || '',
                company: job.company || '',
                description: job.description || '',
                requirements: job.requirements || '',
                skills: job.skills?.join(', ') || '',
                location: job.location || '',
                jobType: job.jobType || 'Full-time',
                salaryMin: job.salary?.min || '',
                salaryMax: job.salary?.max || '',
                experienceMin: job.experience?.min || '',
                experienceMax: job.experience?.max || '',
                deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
            });
        } catch (error) {
            console.error('Error fetching job details:', error);
            alert('Failed to load job details');
            navigate('/recruiter/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const jobData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                salary: {
                    min: parseInt(formData.salaryMin) || 0,
                    max: parseInt(formData.salaryMax) || 0
                },
                experience: {
                    min: parseInt(formData.experienceMin) || 0,
                    max: parseInt(formData.experienceMax) || 0
                }
            };

            if (isEditMode) {
                await api.put(`/jobs/${jobId}`, jobData);
                alert('Job updated successfully!');
            } else {
                await api.post('/jobs', jobData);
                alert('Job posted successfully!');
            }
            navigate('/recruiter/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'post'} job`);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Job Details</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="mb-12">
                <Link to="/recruiter/dashboard" className="inline-flex items-center text-primary-600 font-black text-[10px] uppercase tracking-widest hover:text-primary-700 transition-all mb-6 group">
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
                </Link>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">
                    {isEditMode ? 'Edit Job Posting' : 'Post a New Job'}
                </h1>
                <p className="text-slate-500 font-medium italic">Provide accurate details to find the best candidates.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-premium overflow-hidden">
                <div className="bg-slate-900 p-10 text-white flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary-400 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-primary-400/20 animate-pulse">
                        {isEditMode ? '📝' : '💼'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Job Information</h2>
                        <p className="text-slate-400 font-medium text-xs tracking-widest opacity-60">All fields marked with * are mandatory.</p>
                    </div>
                </div>

                <div className="p-10 space-y-12">
                    {/* Primary Info */}
                    <div className="grid md:grid-cols-2 gap-10 pb-10 border-b border-slate-100">
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Job Title *</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-bold text-sm"
                                placeholder="e.g., Senior Frontend Developer"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Company Name *</label>
                            <input
                                type="text"
                                name="company"
                                required
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-bold text-sm"
                                placeholder="e.g., Tech Solutions Inc."
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Job Description *</label>
                            <textarea
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:outline-none focus:border-primary-400 transition-all font-medium text-sm leading-relaxed"
                                placeholder="Enter detailed job roles and responsibilities..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Requirements *</label>
                            <textarea
                                name="requirements"
                                required
                                value={formData.requirements}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:outline-none focus:border-primary-400 transition-all font-medium text-sm leading-relaxed"
                                placeholder="List educational qualifications and experience required..."
                            />
                        </div>
                    </div>

                    {/* Skills & Location */}
                    <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-slate-100">
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Required Skills (Comma-Separated) *</label>
                            <input
                                type="text"
                                name="skills"
                                required
                                value={formData.skills}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-bold text-sm"
                                placeholder="React, Node.js, TypeScript, etc."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-bold text-sm"
                                    placeholder="Remote, Bangalore, Mumbai"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Job Type *</label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Numeric Parameters with Common Phrasing */}
                    <div className="grid md:grid-cols-3 gap-10 pt-10 border-t border-slate-100">
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Salary Range (Min - Max)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    name="salaryMin"
                                    value={formData.salaryMin}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-bold text-sm"
                                    placeholder="Min ₹"
                                />
                                <span className="text-slate-300 font-black">—</span>
                                <input
                                    type="number"
                                    name="salaryMax"
                                    value={formData.salaryMax}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-bold text-sm"
                                    placeholder="Max ₹"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Experience Required (Years)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    name="experienceMin"
                                    value={formData.experienceMin}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-bold text-sm"
                                    placeholder="Min Yr"
                                />
                                <span className="text-slate-300 font-black">—</span>
                                <input
                                    type="number"
                                    name="experienceMax"
                                    value={formData.experienceMax}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-bold text-sm"
                                    placeholder="Max Yr"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Application Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-bold text-sm uppercase cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-6 pt-10">
                        <button
                            type="button"
                            onClick={() => navigate('/recruiter/dashboard')}
                            className="flex-1 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-5 bg-primary-400 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-primary-500 shadow-xl shadow-primary-200/50 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                        >
                            {isEditMode ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Update Job
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Post Job
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RecruiterPostJob;
