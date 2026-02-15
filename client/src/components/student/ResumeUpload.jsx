import { useState } from 'react';
import api from '../../api/axios';

const ResumeUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Please upload a PDF or DOCX file.');
                setFile(null);
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB.');
                setFile(null);
                return;
            }
            setError('');
            setFile(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await api.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onUploadSuccess(response.data);
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error uploading resume. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-[3rem] border border-primary-100 shadow-premium relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🚀</div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">AI Job Matcher</h3>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Upload resume for instant matches</p>
                    </div>
                </div>

                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="relative">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="resume-upload"
                            accept=".pdf,.docx"
                        />
                        <label
                            htmlFor="resume-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary-100 rounded-[2rem] bg-slate-50/50 hover:bg-primary-50 hover:border-primary-300 transition-all cursor-pointer group/label"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <span className="text-3xl mb-2 group-hover/label:scale-110 transition-transform">📄</span>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                    {file ? file.name : 'Choose Resume (PDF/DOCX)'}
                                </p>
                            </div>
                        </label>
                    </div>

                    {error && (
                        <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest animate-pulse">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className="w-full py-4 bg-primary-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-primary-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Analyzing Intelligence...' : 'Initiate Match Analysis'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResumeUpload;
