import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/users/stats/overview');
            setStats(response.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <h3 className="text-lg font-medium mb-2">Total Users</h3>
                    <p className="text-4xl font-bold">{stats?.users.total || 0}</p>
                </div>
                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <h3 className="text-lg font-medium mb-2">Students</h3>
                    <p className="text-4xl font-bold">{stats?.users.students || 0}</p>
                </div>
                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <h3 className="text-lg font-medium mb-2">Recruiters</h3>
                    <p className="text-4xl font-bold">{stats?.users.recruiters || 0}</p>
                </div>
                <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                    <h3 className="text-lg font-medium mb-2">Active Jobs</h3>
                    <p className="text-4xl font-bold">{stats?.jobs.active || 0}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Applications Overview</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>Total Applications</span>
                            <span className="font-bold">{stats?.applications.total || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                            <span>Placed Students</span>
                            <span className="font-bold text-green-600">{stats?.applications.placed || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Jobs Overview</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>Total Jobs</span>
                            <span className="font-bold">{stats?.jobs.total || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                            <span>Active Jobs</span>
                            <span className="font-bold text-blue-600">{stats?.jobs.active || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
