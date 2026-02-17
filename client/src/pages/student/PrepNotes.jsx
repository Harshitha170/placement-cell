import { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentPrepNotes = () => {
    const [prepNotes, setPrepNotes] = useState([]);
    const [filter, setFilter] = useState({ company: '', category: '' });
    const [loading, setLoading] = useState(true);

    const getAssetUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;

        // Get base URL (remove /api from the end if present)
        const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
        return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    useEffect(() => {
        fetchPrepNotes();
    }, [filter]);

    const fetchPrepNotes = async () => {
        try {
            const params = new URLSearchParams();
            if (filter.company) params.append('company', filter.company);
            if (filter.category) params.append('category', filter.category);

            const response = await api.get(`/prep-notes?${params}`);
            setPrepNotes(response.data);
        } catch (error) {
            console.error('Error fetching prep notes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Knowledge Vault</h1>
                    <p className="text-slate-500 font-medium italic">Curated preparation guides for elite career paths.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Filter company..."
                            value={filter.company}
                            onChange={(e) => setFilter({ ...filter, company: e.target.value })}
                            className="pl-4 pr-10 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-400 text-xs font-bold uppercase tracking-widest transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">🏢</span>
                    </div>
                    <div className="relative">
                        <select
                            value={filter.category}
                            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                            className="pl-4 pr-10 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-400 text-xs font-bold uppercase tracking-widest transition-all appearance-none cursor-pointer min-w-[160px]"
                        >
                            <option value="">All Streams</option>
                            <option value="technical">Technical</option>
                            <option value="hr">General HR</option>
                            <option value="coding">Algorithm</option>
                            <option value="system_design">High Level Design</option>
                            <option value="behavioral">Soft Skills</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">▾</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Vault</p>
                </div>
            ) : prepNotes.length > 0 ? (
                <div className="grid gap-10">
                    {prepNotes.map((note) => (
                        <div key={note._id} className="group relative bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-sm hover:shadow-3xl hover:border-primary-100 transition-all duration-500 overflow-hidden">
                            <div className="flex flex-col lg:flex-row">
                                {/* Left Decor */}
                                <div className="hidden lg:flex w-2 bg-slate-50 group-hover:bg-primary-400 transition-colors duration-500"></div>

                                <div className="flex-1 p-10">
                                    <div className="flex flex-wrap justify-between items-start mb-8 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100">
                                                    {note.category}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${note.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    note.difficulty === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-rose-50 text-rose-600 border-rose-100'
                                                    }`}>
                                                    {note.difficulty} Level
                                                </span>
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors pt-2">
                                                {note.topic}
                                            </h3>
                                            <p className="text-slate-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 italic">
                                                <span>{note.company}</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span>Prep Guide</span>
                                            </p>
                                        </div>
                                        <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-primary-400 hover:text-white transition-all shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="prose prose-slate max-w-none">
                                        <p className="text-slate-600 text-lg leading-relaxed font-medium mb-10 border-l-4 border-slate-100 pl-6 italic bg-slate-50/50 py-4 pr-4 rounded-r-2xl">
                                            "{note.content}"
                                        </p>
                                    </div>

                                    {note.tips && note.tips.length > 0 && (
                                        <div className="mb-10 lg:grid lg:grid-cols-2 gap-8">
                                            <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary-400 mb-6 flex items-center gap-2">
                                                    <span className="w-6 h-6 bg-primary-400/10 rounded-lg flex items-center justify-center text-sm">💡</span>
                                                    Pro Strategist Tips
                                                </h4>
                                                <ul className="space-y-4">
                                                    {note.tips.map((tip, idx) => (
                                                        <li key={idx} className="flex gap-4 group/tip">
                                                            <span className="text-primary-400 font-bold group-hover/tip:translate-x-1 transition-transform">→</span>
                                                            <span className="text-slate-300 text-sm font-medium leading-relaxed">{tip}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="hidden lg:block bg-primary-50 rounded-[2rem] p-8 border-2 border-primary-100 flex flex-col items-center justify-center relative overflow-hidden group/box">
                                                <div className="absolute top-0 right-0 p-4 text-primary-200 text-8xl font-black opacity-10 select-none">PASS</div>
                                                <div className="relative z-10 text-center">
                                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mx-auto mb-4 group-hover/box:scale-110 transition-transform">⭐</div>
                                                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Success Metric</p>
                                                    <p className="text-slate-900 font-black text-xl uppercase mb-4">High Impact Note</p>

                                                    {note.fileUrl && (
                                                        <a
                                                            href={getAssetUrl(note.fileUrl)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                                                        >
                                                            <span>📄</span> Download Material
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {note.tags && note.tags.length > 0 && (
                                        <div className="flex gap-3 flex-wrap">
                                            {note.tags.map((tag, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:border-primary-200 hover:text-primary-500 transition-all cursor-default">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 py-32 text-center">
                    <div className="text-8xl mb-6 grayscale">🗝️</div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Vault Locked</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">No preparation guides found for these filters. Unlock your potential by exploring other companies.</p>
                </div>
            )}
        </div>
    );
};

export default StudentPrepNotes;
