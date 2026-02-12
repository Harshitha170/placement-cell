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
            // Fetch application to get student and job details
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
            // First schedule the interview
            await api.post('/interviews', {
                applicationId,
                jobId: application.jobId._id,
                studentId: application.studentId._id,
                ...formData
            });

            // Update application status to interview_scheduled
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

    if (loading) return <div className="text-center py-12">Loading...</div>;

    if (!application) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="card text-center py-12">
                    <p className="text-red-600 text-lg">Application not found</p>
                    <Link to="/recruiter/dashboard" className="btn-primary mt-4 inline-block">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to={`/recruiter/job/${application.jobId._id}/applicants`} className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
                ← Back to Applicants
            </Link>

            <div className="card">
                <h1 className="text-3xl font-bold mb-6">Schedule Interview</h1>

                {/* Application Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Candidate Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Candidate</p>
                            <p className="font-medium">{application.studentId?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{application.studentId?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Position</p>
                            <p className="font-medium">{application.jobId?.title}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Company</p>
                            <p className="font-medium">{application.jobId?.company}</p>
                        </div>
                    </div>
                </div>

                {/* Interview Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Interview Date & Time *
                        </label>
                        <input
                            type="datetime-local"
                            name="scheduledDate"
                            value={formData.scheduledDate}
                            onChange={handleChange}
                            min={new Date().toISOString().slice(0, 16)}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration (minutes) *
                        </label>
                        <select
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={90}>1.5 hours</option>
                            <option value={120}>2 hours</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting Type *
                        </label>
                        <select
                            name="meetingType"
                            value={formData.meetingType}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="online">Online</option>
                            <option value="in-person">In-Person</option>
                            <option value="phone">Phone</option>
                        </select>
                    </div>

                    {formData.meetingType === 'online' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meeting Link *
                            </label>
                            <input
                                type="url"
                                name="meetingLink"
                                value={formData.meetingLink}
                                onChange={handleChange}
                                placeholder="https://zoom.us/j/123456789 or Google Meet link"
                                className="input-field"
                                required={formData.meetingType === 'online'}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Provide Zoom, Google Meet, or Microsoft Teams link
                            </p>
                        </div>
                    )}

                    {formData.meetingType === 'in-person' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Building, Room Number, Address"
                                className="input-field"
                                required={formData.meetingType === 'in-person'}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Any special instructions, preparation materials, or topics to cover..."
                            className="input-field"
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> An email notification will be sent to the candidate ({application.studentId?.email}) with the interview details.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            disabled={submitting}
                        >
                            {submitting ? 'Scheduling...' : 'Schedule Interview'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/recruiter/job/${application.jobId._id}/applicants`)}
                            className="btn-secondary flex-1"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleInterview;
