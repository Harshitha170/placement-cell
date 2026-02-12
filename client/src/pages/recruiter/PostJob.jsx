import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const RecruiterPostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        requirements: '',
        skills: '',
        location: '',
        jobType: 'Full-time',
        salaryMin: '',
        salaryMax: '',
        experienceMin: '',
        experienceMax: '',
        deadline: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const jobData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()),
                salary: {
                    min: parseInt(formData.salaryMin),
                    max: parseInt(formData.salaryMax)
                },
                experience: {
                    min: parseInt(formData.experienceMin),
                    max: parseInt(formData.experienceMax)
                }
            };

            await api.post('/jobs', jobData);
            alert('Job posted successfully!');
            navigate('/recruiter/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to post job');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>

            <form onSubmit={handleSubmit} className="card space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Job Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., Software Engineer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Company *</label>
                        <input
                            type="text"
                            name="company"
                            required
                            value={formData.company}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., Tech Corp"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="input-field"
                        placeholder="Describe the role..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Requirements *</label>
                    <textarea
                        name="requirements"
                        required
                        value={formData.requirements}
                        onChange={handleChange}
                        rows="4"
                        className="input-field"
                        placeholder="List the requirements..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Skills (comma-separated) *</label>
                    <input
                        type="text"
                        name="skills"
                        required
                        value={formData.skills}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g., JavaScript, React, Node.js"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Location *</label>
                        <input
                            type="text"
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., Bangalore"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Job Type *</label>
                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Min Salary (₹)</label>
                        <input
                            type="number"
                            name="salaryMin"
                            value={formData.salaryMin}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., 500000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Max Salary (₹)</label>
                        <input
                            type="number"
                            name="salaryMax"
                            value={formData.salaryMax}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., 800000"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Min Experience (years)</label>
                        <input
                            type="number"
                            name="experienceMin"
                            value={formData.experienceMin}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Max Experience (years)</label>
                        <input
                            type="number"
                            name="experienceMax"
                            value={formData.experienceMax}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="5"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Application Deadline</label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <div className="flex gap-4">
                    <button type="submit" className="btn-primary">
                        Post Job
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/recruiter/dashboard')}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecruiterPostJob;
