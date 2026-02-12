import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../../App.css';

const MockInterview = () => {
    const navigate = useNavigate();
    const [mockInterviews, setMockInterviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showStartModal, setShowStartModal] = useState(false);
    const [formData, setFormData] = useState({
        jobRole: 'Software Engineer',
        difficulty: 'Medium',
        category: 'Technical'
    });

    useEffect(() => {
        fetchMockInterviews();
        fetchStats();
    }, []);

    const fetchMockInterviews = async () => {
        try {
            const response = await api.get('/mock-interviews/my-interviews');
            setMockInterviews(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching mock interviews:', error);
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/mock-interviews/stats/overview');
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleStartInterview = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/mock-interviews/start', formData);
            navigate(`/student/mock-interview/${response.data.data._id}`);
        } catch (error) {
            console.error('Error starting mock interview:', error);
            alert('Failed to start mock interview');
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Completed': return '#27ae60';
            case 'In Progress': return '#f39c12';
            case 'Abandoned': return '#95a5a6';
            default: return '#3498db';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#27ae60';
        if (score >= 60) return '#f39c12';
        return '#e74c3c';
    };

    return (
        <div className="container">
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h1>🎤 Mock Interviews</h1>
                    <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
                        Practice and improve your interview skills with AI-powered mock interviews
                    </p>
                </div>
                <button
                    onClick={() => setShowStartModal(true)}
                    className="btn btn-primary"
                >
                    ➕ Start New Mock Interview
                </button>
            </div>

            {/* Stats Section */}
            {stats && stats.totalMocks > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
                            {stats.totalMocks}
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Mock Interviews</div>
                    </div>

                    <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
                            {stats.avgScore}%
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>Average Score</div>
                    </div>

                    <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
                            {stats.bestScore}%
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>Best Score</div>
                    </div>

                    <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
                            {stats.improvementRate > 0 ? '+' : ''}{stats.improvementRate}%
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>Improvement Rate</div>
                    </div>
                </div>
            )}

            {/* Start Interview Modal */}
            {showStartModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Start Mock Interview</h2>
                            <button
                                onClick={() => setShowStartModal(false)}
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#7f8c8d'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleStartInterview}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                    Job Role
                                </label>
                                <select
                                    value={formData.jobRole}
                                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <option value="Software Engineer">Software Engineer</option>
                                    <option value="Data Scientist">Data Scientist</option>
                                    <option value="Frontend Developer">Frontend Developer</option>
                                    <option value="Backend Developer">Backend Developer</option>
                                    <option value="Full Stack Developer">Full Stack Developer</option>
                                    <option value="DevOps Engineer">DevOps Engineer</option>
                                    <option value="Product Manager">Product Manager</option>
                                    <option value="Default">Other</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <option value="Technical">Technical</option>
                                    <option value="HR">HR / Behavioral</option>
                                    <option value="Behavioral">Behavioral</option>
                                    <option value="Case Study">Case Study</option>
                                    <option value="Mixed">Mixed</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                    Difficulty Level
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {['Easy', 'Medium', 'Hard'].map(level => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, difficulty: level })}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                border: formData.difficulty === level ? '2px solid #3498db' : '1px solid #ddd',
                                                borderRadius: '4px',
                                                background: formData.difficulty === level ? '#e3f2fd' : 'white',
                                                cursor: 'pointer',
                                                fontWeight: formData.difficulty === level ? '600' : '400'
                                            }}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                                <small style={{ color: '#7f8c8d', marginTop: '5px', display: 'block' }}>
                                    Easy: 3 questions | Medium: 5 questions | Hard: 7 questions
                                </small>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowStartModal(false)}
                                    className="btn"
                                    style={{ flex: 1, backgroundColor: '#95a5a6' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    Start Interview
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Interview History */}
            <div className="card">
                <h2 style={{ marginTop: 0 }}>📋 Interview History</h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                        Loading...
                    </div>
                ) : mockInterviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
                        <h3>No Mock Interviews Yet</h3>
                        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                            Start your first mock interview to practice and improve your skills
                        </p>
                        <button
                            onClick={() => setShowStartModal(true)}
                            className="btn btn-primary"
                        >
                            Start Your First Interview
                        </button>
                    </div>
                ) : (
                    <div>
                        {mockInterviews.map(interview => (
                            <div
                                key={interview._id}
                                style={{
                                    padding: '20px',
                                    border: '1px solid #ecf0f1',
                                    borderRadius: '8px',
                                    marginBottom: '15px',
                                    cursor: interview.status === 'Completed' ? 'pointer' : 'default',
                                    transition: 'all 0.3s',
                                    ':hover': interview.status === 'Completed' ? { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } : {}
                                }}
                                onClick={() => interview.status === 'Completed' && navigate(`/student/mock-interview/${interview._id}`)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                                            {interview.jobRole} - {interview.category}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <span className="badge" style={{ backgroundColor: getStatusBadgeColor(interview.status) }}>
                                                {interview.status}
                                            </span>
                                            <span className="badge" style={{ backgroundColor: '#95a5a6' }}>
                                                {interview.difficulty}
                                            </span>
                                            <span className="badge" style={{ backgroundColor: '#3498db' }}>
                                                {interview.questions.length} questions
                                            </span>
                                        </div>
                                    </div>

                                    {interview.status === 'Completed' && (
                                        <div style={{
                                            fontSize: '32px',
                                            fontWeight: 'bold',
                                            color: getScoreColor(interview.overallScore)
                                        }}>
                                            {interview.overallScore}%
                                        </div>
                                    )}
                                </div>

                                {interview.status === 'Completed' && interview.analysisReport && (
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '15px',
                                        borderRadius: '6px',
                                        marginTop: '15px'
                                    }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                            gap: '15px',
                                            marginBottom: '10px'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>
                                                    Technical
                                                </div>
                                                <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                                                    {interview.analysisReport.technicalScore}%
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>
                                                    Communication
                                                </div>
                                                <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                                                    {interview.analysisReport.communicationScore}%
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>
                                                    Clarity
                                                </div>
                                                <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                                                    {interview.analysisReport.clarityScore}%
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>
                                                    Confidence
                                                </div>
                                                <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                                                    {interview.analysisReport.confidenceScore}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '10px' }}>
                                    {new Date(interview.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>

                                {interview.status === 'In Progress' && (
                                    <button
                                        onClick={() => navigate(`/student/mock-interview/${interview._id}`)}
                                        className="btn btn-primary"
                                        style={{ marginTop: '15px' }}
                                    >
                                        Continue Interview
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MockInterview;
