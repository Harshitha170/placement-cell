import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const StudentDashboard = () => {
    const [stats, setStats] = useState({ applications: 0, interviews: 0 });
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [jobsRes, appsRes, interviewsRes] = await Promise.all([
                api.get('/jobs?limit=5'),
                api.get('/applications/my-applications'),
                api.get('/interviews/my-interviews')
            ]);

            setRecentJobs(jobsRes.data.slice(0, 5));
            setStats({
                applications: appsRes.data.length,
                interviews: interviewsRes.data.length
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <h3 className="text-lg font-medium mb-2">My Applications</h3>
                    <p className="text-4xl font-bold">{stats.applications}</p>
                </div>
                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <h3 className="text-lg font-medium mb-2">Upcoming Interviews</h3>
                    <p className="text-4xl font-bold">{stats.interviews}</p>
                </div>
                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <h3 className="text-lg font-medium mb-2">Profile Completion</h3>
                    <p className="text-4xl font-bold">75%</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card mb-8">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/student/jobs" className="btn-primary text-center">
                        Browse Jobs
                    </Link>
                    <Link to="/student/ats-scanner" className="btn-primary text-center">
                        Scan Resume
                    </Link>
                    <Link to="/student/prep-notes" className="btn-primary text-center">
                        Prep Notes
                    </Link>
                    <Link to="/profile" className="btn-secondary text-center">
                        Edit Profile
                    </Link>
                </div>
            </div>

            {/* Recent Jobs */}
            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recent Job Openings</h2>
                    <Link to="/student/jobs" className="text-primary-600 hover:text-primary-700 font-medium">
                        View All →
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentJobs.length > 0 ? (
                        recentJobs.map((job) => (
                            <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                <p className="text-gray-600">{job.company}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="badge badge-info">{job.location}</span>
                                    <span className="badge badge-success">{job.jobType}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No jobs available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
