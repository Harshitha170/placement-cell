import { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, [search]);

    const fetchJobs = async () => {
        try {
            const response = await api.get(`/jobs?search=${search}`);
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const openApplicationModal = (job) => {
        setSelectedJob(job);
        setShowModal(true);
        setResumeFile(null);
        setCoverLetter('');
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedJob(null);
        setResumeFile(null);
        setCoverLetter('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF, DOC, or DOCX file');
                e.target.value = '';
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                e.target.value = '';
                return;
            }
            setResumeFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            alert('Please upload your resume');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('jobId', selectedJob._id);
            formData.append('resume', resumeFile);
            formData.append('coverLetter', coverLetter);

            await api.post('/applications', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Application submitted successfully!');
            closeModal();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to apply');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">Browse Jobs</h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field max-w-md"
                />
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <div key={job._id} className="card">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
                                    <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                                    <p className="text-gray-600 mb-4">{job.description}</p>
                                    <div className="flex gap-2 mb-4">
                                        <span className="badge badge-info">{job.location}</span>
                                        <span className="badge badge-success">{job.jobType}</span>
                                        {job.salary && (
                                            <span className="badge badge-warning">
                                                ₹{job.salary.min} - ₹{job.salary.max}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {job.skills?.map((skill, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => openApplicationModal(job)}
                                    className="btn-primary ml-4"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Application Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Apply for {selectedJob?.title}</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Resume (Required) *
                                </label>
                                <p className="text-sm text-gray-600 mb-2">
                                    Upload a fresh resume specifically for this position (PDF, DOC, or DOCX - Max 5MB)
                                </p>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="input-field"
                                    required
                                />
                                {resumeFile && (
                                    <p className="mt-2 text-sm text-green-600">
                                        Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(2)} KB)
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cover Letter (Optional)
                                </label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    rows="6"
                                    placeholder="Write a compelling cover letter explaining why you're a great fit for this role..."
                                    className="input-field"
                                />
                            </div>

                            <div className="flex gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn-secondary"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentJobs;
