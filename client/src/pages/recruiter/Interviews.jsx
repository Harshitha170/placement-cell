import { useState, useEffect } from 'react';
import api from '../../api/axios';

const RecruiterInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">Scheduled Interviews</h1>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : interviews.length > 0 ? (
                <div className="grid gap-4">
                    {interviews.map((interview) => (
                        <div key={interview._id} className="card">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold">{interview.jobId?.title}</h3>
                                    <p className="text-gray-600 mb-2">
                                        Candidate: {interview.studentId?.name} ({interview.studentId?.email})
                                    </p>
                                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Date & Time</p>
                                            <p className="font-medium">
                                                {new Date(interview.scheduledDate).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="font-medium">{interview.duration} minutes</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Type</p>
                                            <p className="font-medium capitalize">{interview.meetingType}</p>
                                        </div>
                                    </div>
                                </div>
                                <span className="badge badge-success">{interview.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <p className="text-gray-500">No scheduled interviews</p>
                </div>
            )}
        </div>
    );
};

export default RecruiterInterviews;
