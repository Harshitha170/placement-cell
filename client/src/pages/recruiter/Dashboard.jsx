import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const RecruiterDashboard = () => {
    const [stats, setStats] = useState({ jobs: 0, applications: 0, interviews: 0 });
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/jobs/recruiter/my-jobs');
            setMyJobs(response.data);
            setStats({ jobs: response.data.length, applications: 0, interviews: 0 });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Recruiter Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <h3 className="text-lg font-medium mb-2">Posted Jobs</h3>
                    <p className="text-4xl font-bold">{stats.jobs}</p>
                </div>
                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <h3 className="text-lg font-medium mb-2">Total Applications</h3>
                    <p className="text-4xl font-bold">{stats.applications}</p>
                </div>
                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <h3 className="text-lg font-medium mb-2">Scheduled Interviews</h3>
                    <p className="text-4xl font-bold">{stats.interviews}</p>
                </div>
            </div>

            <div className="card mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">My Posted Jobs</h2>
                    <Link to="/recruiter/post-job" className="btn-primary">
                        Post New Job
                    </Link>
                </div>
                <div className="space-y-4">
                    {myJobs.map((job) => (
                        <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{job.title}</h3>
                                    <p className="text-gray-600">{job.company}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="badge badge-info">{job.location}</span>
                                        <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                            {job.status}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    to={`/recruiter/job/${job._id}/applicants`}
                                    className="btn-secondary text-sm"
                                >
                                    View Applicants
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
