import { useState } from 'react';
import api from '../../api/axios';

const StudentATSScanner = () => {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setAnalysis(null);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        setLoading(true);
        try {
            const response = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAnalysis(response.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">ATS Resume Scanner</h1>

            <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
                <p className="text-gray-600 mb-4">
                    Upload your resume to get an ATS compatibility score and optimization suggestions.
                </p>
                <div className="space-y-4">
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="btn-primary disabled:opacity-50"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Resume'}
                    </button>
                </div>
            </div>

            {analysis && (
                <div className="space-y-6">
                    {/* ATS Score */}
                    <div className="card">
                        <h2 className="text-2xl font-semibold mb-4">ATS Score</h2>
                        <div className="flex items-center justify-center">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle
                                        className="text-gray-200 stroke-current"
                                        strokeWidth="10"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                    ></circle>
                                    <circle
                                        className={`${analysis.atsScore >= 70 ? 'text-green-600' :
                                                analysis.atsScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                                            } stroke-current`}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                        strokeDasharray={`${analysis.atsScore * 2.51} 251`}
                                        transform="rotate(-90 50 50)"
                                    ></circle>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold">{analysis.atsScore}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Keywords */}
                    <div className="card">
                        <h3 className="text-xl font-semibold mb-4">Keywords Analysis</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium mb-2">Found Keywords ({analysis.keywords.found.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.keywords.found.map((keyword, idx) => (
                                        <span key={idx} className="badge badge-success">{keyword}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="font-medium mb-2">Missing Keywords</p>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.keywords.missing.slice(0, 10).map((keyword, idx) => (
                                        <span key={idx} className="badge badge-warning">{keyword}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="card">
                        <h3 className="text-xl font-semibold mb-4">Resume Sections</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {Object.entries(analysis.sections).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="capitalize">{key.replace('has', '').replace(/([A-Z])/g, ' $1')}</span>
                                    <span className={value ? 'text-green-600' : 'text-red-600'}>
                                        {value ? '✓' : '✗'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="card">
                        <h3 className="text-xl font-semibold mb-4">Suggestions</h3>
                        <ul className="space-y-2">
                            {analysis.overallSuggestions.map((suggestion, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="text-primary-600 mr-2">•</span>
                                    <span>{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentATSScanner;
