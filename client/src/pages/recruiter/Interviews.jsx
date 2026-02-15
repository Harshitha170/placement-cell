import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const RecruiterInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [rescheduleData, setRescheduleData] = useState({
        scheduledDate: '',
        duration: 30
    });
    const [submitting, setSubmitting] = useState(false);

    // Calendar logic
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const response = await api.get('/interviews/recruiter/scheduled');
            setInterviews(response.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReschedule = (interview) => {
        const date = new Date(interview.scheduledDate);
        // Format for datetime-local: YYYY-MM-DDTHH:MM
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

        setSelectedInterview(interview);
        setRescheduleData({
            scheduledDate: localDate,
            duration: interview.duration
        });
        setShowRescheduleModal(true);
    };

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/interviews/${selectedInterview._id}`, rescheduleData);
            alert('Interview rescheduled successfully!');
            fetchInterviews();
            setShowRescheduleModal(false);
        } catch (error) {
            console.error('Error rescheduling:', error);
            alert('Failed to reschedule interview');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelInterview = async (id) => {
        if (window.confirm('Are you sure you want to cancel this interview?')) {
            try {
                await api.put(`/interviews/${id}/cancel`);
                alert('Interview cancelled successfully');
                fetchInterviews();
            } catch (error) {
                console.error('Error cancelling:', error);
                alert('Failed to cancel interview');
            }
        }
    };

    // Calendar Helper Functions
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Padding for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-14 border border-slate-50 opacity-20"></div>);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = new Date(year, month, day).toDateString();
            const hasInterviews = interviews.some(int => new Date(int.scheduledDate).toDateString() === dateStr);

            days.push(
                <div
                    key={day}
                    className={`h-14 border border-slate-50 flex flex-col items-center justify-center relative group transition-all ${hasInterviews ? 'bg-primary-50/50' : 'hover:bg-slate-50'}`}
                >
                    <span className={`text-[10px] font-black ${hasInterviews ? 'text-primary-600' : 'text-slate-400'}`}>{day}</span>
                    {hasInterviews && (
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1 animate-pulse"></div>
                    )}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Scheduled Interviews</h1>
                    <p className="text-slate-500 font-medium italic">Manage all upcoming candidate interviews in one place.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/recruiter/dashboard" className="px-6 py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                        ← Back to Dashboard
                    </Link>
                    <button
                        onClick={() => setShowCalendarModal(true)}
                        className="flex items-center gap-6 px-6 py-4 bg-slate-900 rounded-[2rem] text-white shadow-xl hover:bg-primary-900 group transition-all"
                    >
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 group-hover:text-primary-400 uppercase tracking-widest mb-1">Upcoming</p>
                            <p className="text-2xl font-black">{interviews.length}</p>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📅</div>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Calendar</p>
                </div>
            ) : interviews.length > 0 ? (
                <div className="grid gap-6">
                    {interviews.map((interview) => (
                        <div key={interview._id} className="group relative bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm hover:shadow-3xl hover:border-primary-100 transition-all duration-500">
                            <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                                {/* Date/Time Block */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex flex-col items-center justify-center shadow-lg group-hover:bg-primary-500 transition-colors duration-500">
                                        <p className="text-[10px] font-black uppercase tracking-tight text-white/50">{new Date(interview.scheduledDate).toLocaleString('default', { month: 'short' })}</p>
                                        <p className="text-3xl font-black">{new Date(interview.scheduledDate).getDate()}</p>
                                        <p className="text-[10px] font-black uppercase tracking-tight text-white/50">{new Date(interview.scheduledDate).getFullYear()}</p>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors">{interview.jobId?.title}</h3>
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 italic">Scheduled</span>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-slate-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                            <span className="text-primary-500">👤</span> Candidate: {interview.studentId?.name}
                                        </p>
                                        <p className="text-slate-400 font-bold text-xs flex items-center gap-2">
                                            <span>📧 {interview.studentId?.email}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <span>⏰ {new Date(interview.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Duration</p>
                                            <p className="font-black text-slate-900 uppercase text-xs">⏳ {interview.duration} Minutes</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Medium</p>
                                            <p className="font-black text-slate-900 uppercase text-xs">🌐 {interview.meetingType}</p>
                                        </div>
                                        {interview.meetingLink && (
                                            <div className="col-span-2 md:col-span-1">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Access Link</p>
                                                <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary-500 font-black text-xs hover:underline decoration-2 underline-offset-4">LAUNCH MEETING →</a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="flex flex-col gap-3 min-w-[140px]">
                                    <button
                                        onClick={() => handleOpenReschedule(interview)}
                                        className="w-full px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-50 hover:text-primary-600 border border-slate-100 transition-all font-sans"
                                    >
                                        Reschedule
                                    </button>
                                    <button
                                        onClick={() => handleCancelInterview(interview._id)}
                                        className="w-full px-6 py-4 bg-rose-50 text-rose-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-100 hover:text-rose-600 transition-all font-sans"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 py-32 text-center">
                    <div className="text-8xl mb-6 grayscale">🗓️</div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Clear Calendar</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">No upcoming interviews scheduled. Navigate to a job's talent pool to initiate an engagement.</p>
                </div>
            )}

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
                        <div className="bg-slate-900 p-10 text-white">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-4xl font-black uppercase tracking-tight">Reschedule</h2>
                                <button onClick={() => setShowRescheduleModal(false)} className="text-4xl font-extralight hover:text-primary-400 transition-colors">×</button>
                            </div>
                            <p className="text-slate-400 font-medium italic">Select a new date and time for the interview with <span className="text-white font-bold">{selectedInterview?.studentId?.name}</span>.</p>
                        </div>

                        <form onSubmit={handleRescheduleSubmit} className="p-10 space-y-8">
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">New Appointment Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={rescheduleData.scheduledDate}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, scheduledDate: e.target.value })}
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-primary-400 font-bold text-sm"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">New Duration (Minutes)</label>
                                <select
                                    value={rescheduleData.duration}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, duration: Number(e.target.value) })}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-primary-400 font-bold text-sm"
                                >
                                    <option value={15}>15 Minutes</option>
                                    <option value={30}>30 Minutes</option>
                                    <option value={45}>45 Minutes</option>
                                    <option value={60}>60 Minutes</option>
                                    <option value={90}>90 Minutes</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowRescheduleModal(false)}
                                    className="flex-1 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all font-sans"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-5 bg-primary-400 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-primary-500 shadow-xl shadow-primary-200/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 font-sans"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Updating...' : 'Confirm Reschedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Visual Schedule Modal */}
            {showCalendarModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="bg-primary-900 p-10 text-white relative">
                            <button onClick={() => setShowCalendarModal(false)} className="absolute top-8 right-8 text-4xl font-extralight text-white/50 hover:text-white transition-colors">×</button>
                            <h2 className="text-5xl font-black uppercase tracking-tight mb-2 underline decoration-primary-400 decoration-8 underline-offset-8">Calendar</h2>
                            <p className="text-primary-300 font-medium italic">Your schedule for {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                        </div>

                        <div className="p-10">
                            {/* Calendar Header */}
                            <div className="flex justify-between items-center mb-10 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-3 bg-white rounded-2xl shadow-sm hover:text-primary-500 transition-all font-black text-xs">← Prev</button>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-3 bg-white rounded-2xl shadow-sm hover:text-primary-500 transition-all font-black text-xs">Next →</button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 text-center mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <span key={day} className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">{day}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 border-t border-l border-slate-50 rounded-2xl overflow-hidden">
                                {renderCalendarDays()}
                            </div>

                            <div className="mt-10 flex items-center gap-4 px-6 py-4 bg-primary-50 rounded-3xl border border-primary-100">
                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                                <p className="text-[10px] font-black text-primary-700 uppercase tracking-widest italic">Highlighted days have scheduled interviews.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterInterviews;
