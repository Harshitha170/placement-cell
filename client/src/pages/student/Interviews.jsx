import { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const response = await api.get('/interviews/my-interviews');
            setInterviews(response.data);
        } catch (error) {
            console.error('Error fetching interviews:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">My Interviews</h1>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : interviews.length > 0 ? (
                <div className="grid gap-4">
                    {interviews.map((interview) => (
                        <div key={interview._id} className="card">
                            <h3 className="text-xl font-semibold mb-2">{interview.jobId?.title}</h3>
                            <p className="text-gray-600 mb-2">{interview.jobId?.company}</p>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
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
                                {interview.meetingLink && (
                                    <div>
                                        <p className="text-sm text-gray-500">Meeting Link</p>
                                        <a
                                            href={interview.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-600 hover:underline"
                                        >
                                            Join Meeting
                                        </a>
                                    </div>
                                )}
                            </div>
                            {interview.notes && (
                                <div className="mt-4 p-3 bg-gray-50 rounded">
                                    <p className="text-sm text-gray-500">Notes</p>
                                    <p>{interview.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <p className="text-gray-500">No upcoming interviews</p>
                </div>
            )}
        </div>
    );
};

export default StudentInterviews;
