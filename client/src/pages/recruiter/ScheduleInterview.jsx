import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const ScheduleInterview = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        scheduledDate: '',
        duration: 60,
        meetingType: 'online',
        meetingLink: '',
        location: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchApplicationDetails();
    }, [applicationId]);

    const fetchApplicationDetails = async () => {
        try {
            const response = await api.get(`/applications/${applicationId}`);
            setApplication(response.data);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load application details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post('/interviews', {
                applicationId,
                jobId: application.jobId._id,
                studentId: application.studentId._id,
                ...formData
            });

            await api.put(`/applications/${applicationId}/status`, {
                status: 'interview_scheduled'
            });

            alert('Interview scheduled successfully!');
            navigate(`/recruiter/job/${application.jobId._id}/applicants`);
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || 'Failed to schedule interview');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Initializing Scheduler</p>
        </div>
    );

    if (!application) return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-in fade-in">
            <div className="text-8xl mb-6">⚠️</div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Application Invalid</h3>
            <Link to="/recruiter/dashboard" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-500 transition-all">
                Return to Hub
            </Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            <Link to={`/recruiter/job/${application.jobId._id}/applicants`} className="inline-flex items-center text-primary-600 font-black text-[10px] uppercase tracking-widest hover:text-primary-700 transition-all mb-6 group">
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Selection
            </Link>

            <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-premium overflow-hidden">
                <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight mb-2 italic">Slot Deployment</h1>
                        <p className="text-slate-400 font-medium italic">Scheduling an encounter with <span className="text-primary-400 font-bold not-italic">{application.studentId?.name}</span></p>
                    </div>
                    <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center text-xl text-white">💼</div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Position</p>
                            <p className="text-sm font-black">{application.jobId?.title}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Epoch Selection (Date & Time)</label>
                            <input
                                type="datetime-local"
                                name="scheduledDate"
                                value={formData.scheduledDate}
                                onChange={handleChange}
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-black text-sm uppercase"
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Engagement Duration</label>
                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-black text-sm uppercase appearance-none"
                                required
                            >
                                <option value={30}>30 Minute Sprint</option>
                                <option value={45}>45 Minute Session</option>
                                <option value={60}>1 Hour Deep Dive</option>
                                <option value={90}>1.5 Hour Workshop</option>
                                <option value={120}>2 Hour Intensive</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Channel Vector (Type)</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['online', 'in-person', 'phone'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, meetingType: type })}
                                        className={`p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.meetingType === type ? 'border-primary-400 bg-primary-50 text-primary-600' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 flex flex-col justify-end">
                            {formData.meetingType === 'online' ? (
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1 text-primary-500">Meeting Link (Zoom/Meet)</label>
                                    <input
                                        type="url"
                                        name="meetingLink"
                                        value={formData.meetingLink}
                                        onChange={handleChange}
                                        placeholder="https://zoom.us/j/unique-id"
                                        className="w-full px-6 py-4 bg-primary-50/30 border-2 border-primary-100 rounded-[2rem] focus:outline-none focus:border-primary-400 transition-all font-bold text-sm"
                                        required={formData.meetingType === 'online'}
                                    />
                                </div>
                            ) : formData.meetingType === 'in-person' ? (
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1 text-amber-500">Physical Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Conference Room A, Floor 10"
                                        className="w-full px-6 py-4 bg-amber-50/30 border-2 border-amber-100 rounded-[2rem] focus:outline-none focus:border-amber-400 transition-all font-bold text-sm"
                                        required={formData.meetingType === 'in-person'}
                                    />
                                </div>
                            ) : (
                                <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Telephonic sequence will be initiated using candidate's registered contact.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Recruiter's Directive (Optional Notes)</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Share preparation materials, key topics, or interviewer list..."
                            className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:outline-none focus:border-primary-400 transition-all font-medium text-sm leading-relaxed"
                        />
                    </div>

                    <div className="flex items-center gap-4 p-8 bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🔔</div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1">Confirmation Alert</p>
                            <p className="text-sm font-medium text-indigo-700 leading-relaxed italic">Upon deployment, an automated briefing will be dispatched to <span className="font-black not-italic text-indigo-900 px-1">{application.studentId?.email}</span></p>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate(`/recruiter/job/${application.jobId._id}/applicants`)}
                            className="flex-1 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                            disabled={submitting}
                        >
                            Cancel Deployment
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-5 bg-primary-400 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-primary-500 shadow-xl shadow-primary-200/50 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Deploying Slot...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Finalize Interview
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleInterview;
