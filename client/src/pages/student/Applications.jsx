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

    const getStatusBadge = (status) => {
        const badges = {
            applied: 'badge-info',
            shortlisted: 'badge-warning',
            interview_scheduled: 'badge-success',
            rejected: 'badge-danger',
            hired: 'badge-success'
        };
        return badges[status] || 'badge-info';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">My Applications</h1>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : applications.length > 0 ? (
                <div className="grid gap-4">
                    {applications.map((app) => (
                        <div key={app._id} className="card">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold">{app.jobId?.title}</h3>
                                    <p className="text-gray-600">{app.jobId?.company}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`badge ${getStatusBadge(app.status)}`}>
                                    {app.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <p className="text-gray-500">No applications yet</p>
                </div>
            )}
        </div>
    );
};

export default StudentApplications;
