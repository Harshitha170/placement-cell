import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const JobApplicants = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    const fetchApplications = async () => {
        try {
            const [appsResponse, jobResponse] = await Promise.all([
                api.get(`/applications/job/${jobId}`),
                api.get(`/jobs/${jobId}`)
            ]);
            setApplications(appsResponse.data);
            setJobDetails(jobResponse.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (applicationId, newStatus) => {
        try {
            await api.put(`/applications/${applicationId}/status`, { status: newStatus });
            alert('Status updated successfully!');
            fetchApplications();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update status');
        }
    };

    const viewDetails = (application) => {
        setSelectedApp(application);
    };

    const closeDetailsModal = () => {
        setSelectedApp(null);
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <Link to="/recruiter/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold mb-2">Applications for {jobDetails?.title}</h1>
                <p className="text-gray-600">{jobDetails?.company} • {applications.length} applicants</p>
            </div>

            {applications.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-600 text-lg">No applications yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app._id} className="card">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold">{app.studentId?.name}</h3>
                                        <span className={`badge ${app.status === 'applied' ? 'badge-info' :
                                                app.status === 'shortlisted' ? 'badge-warning' :
                                                    app.status === 'interview_scheduled' ? 'badge-success' :
                                                        app.status === 'hired' ? 'badge-success' :
                                                            'badge-danger'
                                            }`}>
                                            {app.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-1">{app.studentId?.email}</p>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Applied on: {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    {app.studentId?.studentProfile && (
                                        <div className="flex gap-2 flex-wrap">
                                            {app.studentId.studentProfile.skills?.slice(0, 5).map((skill, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 ml-4">
                                    <button
                                        onClick={() => viewDetails(app)}
                                        className="btn-primary text-sm whitespace-nowrap"
                                    >
                                        View Full Details
                                    </button>
                                    {app.resumeUrl && (
                                        <a
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${app.resumeUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-secondary text-sm text-center whitespace-nowrap"
                                        >
                                            📄 View Resume
                                        </a>
                                    )}
                                    <select
                                        value={app.status}
                                        onChange={(e) => updateStatus(app._id, e.target.value)}
                                        className="input-field text-sm"
                                    >
                                        <option value="applied">Applied</option>
                                        <option value="shortlisted">Shortlisted</option>
                                        <option value="interview_scheduled">Interview Scheduled</option>
                                        <option value="hired">Hired</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Application Details Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Application Details</h2>
                            <button onClick={closeDetailsModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                                ×
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Candidate Info */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-primary-600">Candidate Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-medium">{selectedApp.studentId?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{selectedApp.studentId?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-medium">{selectedApp.studentId?.studentProfile?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">College</p>
                                        <p className="font-medium">{selectedApp.studentId?.studentProfile?.college || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Graduation Year</p>
                                        <p className="font-medium">{selectedApp.studentId?.studentProfile?.graduationYear || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">CGPA</p>
                                        <p className="font-medium">{selectedApp.studentId?.studentProfile?.cgpa || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            {selectedApp.studentId?.studentProfile?.skills && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-primary-600">Skills</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        {selectedApp.studentId.studentProfile.skills.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cover Letter */}
                            {selectedApp.coverLetter && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-primary-600">Cover Letter</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.coverLetter}</p>
                                    </div>
                                </div>
                            )}

                            {/* Application Status */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-primary-600">Application Status</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <span className={`inline-block mt-1 badge ${selectedApp.status === 'applied' ? 'badge-info' :
                                                selectedApp.status === 'shortlisted' ? 'badge-warning' :
                                                    selectedApp.status === 'interview_scheduled' ? 'badge-success' :
                                                        selectedApp.status === 'hired' ? 'badge-success' :
                                                            'badge-danger'
                                            }`}>
                                            {selectedApp.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Applied On</p>
                                        <p className="font-medium mt-1">
                                            {new Date(selectedApp.appliedAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Resume */}
                            {selectedApp.resumeUrl && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-primary-600">Resume</h3>
                                    <a
                                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${selectedApp.resumeUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary inline-block"
                                    >
                                        📄 Open Resume in New Tab
                                    </a>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t">
                                <Link
                                    to={`/recruiter/schedule-interview/${selectedApp._id}`}
                                    className="btn-primary flex-1 text-center"
                                >
                                    Schedule Interview
                                </Link>
                                <button
                                    onClick={closeDetailsModal}
                                    className="btn-secondary flex-1"
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

export default JobApplicants;
