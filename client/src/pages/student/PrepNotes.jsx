import { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentPrepNotes = () => {
    const [prepNotes, setPrepNotes] = useState([]);
    const [filter, setFilter] = useState({ company: '', category: '' });
    const [loading, setLoading] = useState(true);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">Interview Preparation Notes</h1>

            <div className="card mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Filter by Company</label>
                        <input
                            type="text"
                            placeholder="e.g., Google, Microsoft"
                            value={filter.company}
                            onChange={(e) => setFilter({ ...filter, company: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Filter by Category</label>
                        <select
                            value={filter.category}
                            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                            className="input-field"
                        >
                            <option value="">All Categories</option>
                            <option value="technical">Technical</option>
                            <option value="hr">HR</option>
                            <option value="coding">Coding</option>
                            <option value="system_design">System Design</option>
                            <option value="behavioral">Behavioral</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : prepNotes.length > 0 ? (
                <div className="grid gap-6">
                    {prepNotes.map((note) => (
                        <div key={note._id} className="card">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold">{note.topic}</h3>
                                    <p className="text-gray-600">{note.company}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="badge badge-info capitalize">{note.category}</span>
                                    <span className={`badge ${note.difficulty === 'easy' ? 'badge-success' :
                                            note.difficulty === 'medium' ? 'badge-warning' : 'badge-danger'
                                        }`}>
                                        {note.difficulty}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">{note.content}</p>
                            {note.tips && note.tips.length > 0 && (
                                <div className="mb-4">
                                    <p className="font-medium mb-2">Tips:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {note.tips.map((tip, idx) => (
                                            <li key={idx} className="text-gray-700">{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {note.tags && note.tags.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {note.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <p className="text-gray-500">No prep notes found</p>
                </div>
            )}
        </div>
    );
};

export default StudentPrepNotes;
