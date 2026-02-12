import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminPrepNotes = () => {
    const [prepNotes, setPrepNotes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        topic: '',
        category: 'technical',
        difficulty: 'medium',
        content: '',
        tips: '',
        tags: ''
    });

    useEffect(() => {
        fetchPrepNotes();
    }, []);

    const fetchPrepNotes = async () => {
        try {
            const response = await api.get('/prep-notes');
            setPrepNotes(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                tips: formData.tips.split('\n').filter(t => t.trim()),
                tags: formData.tags.split(',').map(t => t.trim())
            };
            await api.post('/prep-notes', data);
            alert('Prep note created successfully!');
            setShowForm(false);
            setFormData({
                company: '',
                topic: '',
                category: 'technical',
                difficulty: 'medium',
                content: '',
                tips: '',
                tags: ''
            });
            fetchPrepNotes();
        } catch (error) {
            alert('Failed to create prep note');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this prep note?')) return;
        try {
            await api.delete(`/prep-notes/${id}`);
            setPrepNotes(prepNotes.filter(n => n._id !== id));
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Prep Notes</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    {showForm ? 'Cancel' : 'Create New'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card mb-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Company</label>
                            <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Topic</label>
                            <input
                                type="text"
                                required
                                value={formData.topic}
                                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="input-field"
                            >
                                <option value="technical">Technical</option>
                                <option value="hr">HR</option>
                                <option value="coding">Coding</option>
                                <option value="system_design">System Design</option>
                                <option value="behavioral">Behavioral</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="input-field"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Content</label>
                        <textarea
                            required
                            rows="4"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Tips (one per line)</label>
                        <textarea
                            rows="3"
                            value={formData.tips}
                            onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="btn-primary">Create Prep Note</button>
                </form>
            )}

            <div className="grid gap-4">
                {prepNotes.map((note) => (
                    <div key={note._id} className="card">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold">{note.topic}</h3>
                                <p className="text-gray-600">{note.company}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="badge badge-info">{note.category}</span>
                                    <span className="badge badge-warning">{note.difficulty}</span>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(note._id)} className="btn-danger text-sm">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPrepNotes;
