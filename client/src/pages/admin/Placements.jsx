import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminPlacements = () => {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlacements();
    }, []);

    const fetchPlacements = async () => {
        try {
            const response = await api.get('/applications/admin/placements');
            setPlacements(response.data);
        } catch (error) {
            console.error('Error fetching placements:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Placements</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="mb-12">
                <Link to="/admin/dashboard" className="inline-flex items-center text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:text-indigo-700 transition-all mb-6 group">
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Analytics
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase italic underline decoration-emerald-400 decoration-8 underline-offset-8">Placement List</h1>
                        <p className="text-slate-500 font-medium italic">List of students successfully hired through Career Bridge.</p>
                    </div>
                    <div className="bg-slate-900 px-8 py-4 rounded-[2rem] text-white shadow-2xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Placements</p>
                        <p className="text-3xl font-black text-emerald-400">{placements.length}</p>
                    </div>
                </div>
            </div>

            {placements.length === 0 ? (
                <div className="bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 py-32 text-center">
                    <div className="text-8xl mb-6 grayscale">🎊</div>
                    <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tight mb-2">No placements yet</h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto italic">Waiting for the first student to get hired.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] shadow-premium border border-slate-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Placed At</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">College</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Confirmed</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {placements.map((p) => (
                                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm mr-4 shadow-lg">
                                                    {p.studentId?.name?.[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 uppercase group-hover:text-indigo-600 transition-colors">{p.studentId?.name}</div>
                                                    <div className="text-xs text-slate-400 font-medium italic">{p.studentId?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-sm font-black text-slate-900 uppercase italic">{p.jobId?.company}</div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                                {p.jobId?.title}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-xs font-bold text-slate-500">{p.studentId?.studentProfile?.college || 'N/A'}</div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-xs font-black text-slate-400 uppercase">{new Date(p.updatedAt).toLocaleDateString()}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPlacements;
