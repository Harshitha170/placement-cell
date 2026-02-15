import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalRecruiters: 0,
        totalPlaced: 0,
        totalJobs: 0,
        totalApplications: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/users/stats/overview');
            const data = response.data;
            setStats({
                totalStudents: data.users.students,
                totalRecruiters: data.users.recruiters,
                totalPlaced: data.applications.placed,
                totalJobs: data.jobs.active,
                totalApplications: data.applications.total
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Dashboard</p>
        </div>
    );

    const hasAnalytics = stats.totalStudents > 0 || stats.totalApplications > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-12 uppercase italic underline decoration-indigo-400 decoration-8 underline-offset-8">Platform Overview</h1>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="bg-white p-8 rounded-[2rem] shadow-premium border-2 border-slate-50">
                    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Students</h3>
                    <p className="text-4xl font-black text-slate-900">{stats.totalStudents}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-premium border-2 border-slate-50">
                    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Placements</h3>
                    <p className="text-4xl font-black text-emerald-500">{stats.totalPlaced}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-premium border-2 border-slate-50">
                    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Active Jobs</h3>
                    <p className="text-4xl font-black text-indigo-500">{stats.totalJobs}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-premium border-2 border-slate-50">
                    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Applications</h3>
                    <p className="text-4xl font-black text-primary-500">{stats.totalApplications}</p>
                </div>
            </div>

            {/* Charts Section - Only show if data exists */}
            {hasAnalytics ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white p-10 rounded-[3rem] shadow-premium border-2 border-slate-50">
                        <h3 className="text-xl font-black mb-8 text-slate-900 uppercase">Activity Overview</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Students', val: stats.totalStudents },
                                    { name: 'Applications', val: stats.totalApplications },
                                    { name: 'Placements', val: stats.totalPlaced }
                                ]}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="val" fill="#52ab98" radius={[10, 10, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-premium border-2 border-slate-50">
                        <h3 className="text-xl font-black mb-8 text-slate-900 uppercase">Users</h3>
                        <div className="h-80 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Students', value: stats.totalStudents },
                                            { name: 'Recruiters', value: stats.totalRecruiters }
                                        ]}
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        <Cell fill="#6366f1" />
                                        <Cell fill="#e2e8f0" />
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1rem' }}
                                        itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Users</p>
                                <p className="text-3xl font-black text-slate-900">{stats.totalStudents + stats.totalRecruiters}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100 py-32 text-center group">
                    <div className="text-8xl mb-10 group-hover:scale-110 transition-transform duration-500">🕸️</div>
                    <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">No Analytical Data</h3>
                    <p className="text-slate-400 font-medium italic mt-4">Waiting for organizational activity to generate metrics.</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
