import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../../App.css';

const MockInterviewSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answer, setAnswer] = useState('');
    const [timer, setTimer] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        fetchInterviewDetails();
    }, [id]);

    useEffect(() => {
        if (interview && !showResults && interview.status !== 'Completed') {
            const interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [interview, showResults]);

    const fetchInterviewDetails = async () => {
        try {
            const response = await api.get(`/mock-interviews/${id}`);
            setInterview(response.data.data);

            if (response.data.data.status === 'Completed') {
                setShowResults(true);
            } else {
                // Find first unanswered question
                const firstUnanswered = response.data.data.questions.findIndex(q => !q.answer);
                if (firstUnanswered !== -1) {
                    setCurrentQuestion(firstUnanswered);
                }
            }
        } catch (error) {
            console.error('Error fetching interview:', error);
            alert('Failed to load interview');
            navigate('/student/mock-interview');
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            alert('Please provide an answer before submitting');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put(`/mock-interviews/${id}/answer`, {
                questionIndex: currentQuestion,
                answer: answer,
                duration: timer
            });

            // Move to next question or complete
            if (currentQuestion < interview.questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setAnswer('');
                setTimer(0);
                await fetchInterviewDetails();
            } else {
                // Complete the interview
                await handleCompleteInterview();
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer');
        }
        setIsSubmitting(false);
    };

    const handleCompleteInterview = async () => {
        try {
            const response = await api.put(`/mock-interviews/${id}/complete`);
            setInterview(response.data.data);
            setShowResults(true);
        } catch (error) {
            console.error('Error completing interview:', error);
            alert('Failed to complete interview');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score) => {
        if (score >= 8) return '#27ae60';
        if (score >= 6) return '#f39c12';
        return '#e74c3c';
    };

    if (!interview) {
        return (
            <div className="container">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Loading interview...
                </div>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className="container">
                <div className="card">
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h1 style={{ margin: '0 0 10px 0' }}>🎉 Interview Complete!</h1>
                        <p style={{ color: '#7f8c8d', fontSize: '18px' }}>
                            {interview.jobRole} - {interview.category}
                        </p>
                    </div>

                    {/* Overall Score */}
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        background: `linear-gradient(135deg, ${getScoreColor(interview.overallScore)}22 0%, ${getScoreColor(interview.overallScore)}44 100%)`,
                        borderRadius: '12px',
                        marginBottom: '30px'
                    }}>
                        <div style={{ fontSize: '72px', fontWeight: 'bold', color: getScoreColor(interview.overallScore) }}>
                            {interview.overallScore}%
                        </div>
                        <div style={{ fontSize: '20px', color: '#2c3e50', marginTop: '10px' }}>
                            Overall Score
                        </div>
                    </div>

                    {/* Detailed Scores */}
                    {interview.analysisReport && (
                        <div style={{ marginBottom: '30px' }}>
                            <h2>📊 Detailed Analysis</h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '20px',
                                marginTop: '20px'
                            }}>
                                <div className="card" style={{ textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                                    <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>
                                        Technical Skills
                                    </div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976d2' }}>
                                        {interview.analysisReport.technicalScore}%
                                    </div>
                                </div>

                                <div className="card" style={{ textAlign: 'center', backgroundColor: '#f3e5f5' }}>
                                    <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>
                                        Communication
                                    </div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7b1fa2' }}>
                                        {interview.analysisReport.communicationScore}%
                                    </div>
                                </div>

                                <div className="card" style={{ textAlign: 'center', backgroundColor: '#e8f5e9' }}>
                                    <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>
                                        Clarity
                                    </div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#388e3c' }}>
                                        {interview.analysisReport.clarityScore}%
                                    </div>
                                </div>

                                <div className="card" style={{ textAlign: 'center', backgroundColor: '#fff3e0' }}>
                                    <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>
                                        Confidence
                                    </div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f57c00' }}>
                                        {interview.analysisReport.confidenceScore}%
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                marginTop: '20px',
                                padding: '20px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px'
                            }}>
                                <strong>Overall Feedback:</strong>
                                <p style={{ marginTop: '10px', color: '#2c3e50' }}>
                                    {interview.analysisReport.overallFeedback}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Strengths and Improvements */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        <div>
                            <h3 style={{ color: '#27ae60' }}>💪 Strengths</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {interview.strengths.map((strength, idx) => (
                                    <li key={idx} style={{
                                        padding: '10px',
                                        backgroundColor: '#e8f5e9',
                                        borderRadius: '6px',
                                        marginBottom: '10px',
                                        borderLeft: '4px solid #27ae60'
                                    }}>
                                        {strength}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 style={{ color: '#f39c12' }}>📈 Areas for Improvement</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {interview.improvements.map((improvement, idx) => (
                                    <li key={idx} style={{
                                        padding: '10px',
                                        backgroundColor: '#fff3e0',
                                        borderRadius: '6px',
                                        marginBottom: '10px',
                                        borderLeft: '4px solid #f39c12'
                                    }}>
                                        {improvement}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Question-by-Question Review */}
                    <div>
                        <h2>📝 Question Review</h2>
                        {interview.questions.map((q, idx) => (
                            <div key={idx} style={{
                                marginBottom: '20px',
                                padding: '20px',
                                border: '1px solid #ecf0f1',
                                borderRadius: '8px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <h3 style={{ margin: 0, color: '#2c3e50' }}>Question {idx + 1}</h3>
                                    <div style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        color: getScoreColor(q.score)
                                    }}>
                                        {q.score}/10
                                    </div>
                                </div>

                                <p style={{
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    color: '#2c3e50'
                                }}>
                                    {q.question}
                                </p>

                                <div style={{ marginTop: '15px' }}>
                                    <strong>Your Answer:</strong>
                                    <p style={{
                                        marginTop: '10px',
                                        padding: '15px',
                                        backgroundColor: '#fff',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '6px',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {q.answer || 'No answer provided'}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', marginTop: '10px', color: '#7f8c8d', fontSize: '14px' }}>
                                    <div>
                                        ⏱️ Time Taken: {formatTime(q.actualDuration)}
                                    </div>
                                    <div>
                                        🎯 Max Time: {formatTime(q.maxDuration)}
                                    </div>
                                </div>

                                {q.feedback && (
                                    <div style={{
                                        marginTop: '15px',
                                        padding: '12px',
                                        backgroundColor: '#e3f2fd',
                                        borderRadius: '6px',
                                        borderLeft: '4px solid #3498db'
                                    }}>
                                        <strong>Feedback:</strong> {q.feedback}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <button
                            onClick={() => navigate('/student/mock-interview')}
                            className="btn"
                            style={{ flex: 1, backgroundColor: '#95a5a6' }}
                        >
                            Back to Mock Interviews
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                        >
                            Take Another Interview
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Interview in progress
    const question = interview.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / interview.questions.length) * 100;

    return (
        <div className="container">
            <div className="card">
                {/* Header */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h2 style={{ margin: 0 }}>
                            {interview.jobRole} - {interview.category}
                        </h2>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
                            ⏱️ {formatTime(timer)}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#7f8c8d' }}>
                            <span>Question {currentQuestion + 1} of {interview.questions.length}</span>
                            <span>{Math.round(progress)}% Complete</span>
                        </div>
                        <div style={{
                            height: '8px',
                            backgroundColor: '#ecf0f1',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                backgroundColor: '#3498db',
                                transition: 'width 0.3s'
                            }} />
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        borderLeft: '4px solid #3498db'
                    }}>
                        <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '10px' }}>
                            QUESTION {currentQuestion + 1}
                        </div>
                        <h3 style={{ margin: 0, color: '#2c3e50', lineHeight: '1.6' }}>
                            {question.question}
                        </h3>
                        <div style={{ marginTop: '15px', fontSize: '14px', color: '#7f8c8d' }}>
                            💡 Recommended time: {formatTime(question.maxDuration)}
                        </div>
                    </div>
                </div>

                {/* Answer Input */}
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#2c3e50' }}>
                        Your Answer:
                    </label>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here... Be detailed and explain your thought process."
                        style={{
                            width: '100%',
                            minHeight: '200px',
                            padding: '15px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                    />
                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#7f8c8d' }}>
                        Words: {answer.trim().split(/\s+/).filter(w => w).length}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to quit this interview?')) {
                                navigate('/student/mock-interview');
                            }
                        }}
                        className="btn"
                        style={{ backgroundColor: '#e74c3c', color: 'white' }}
                    >
                        Quit Interview
                    </button>

                    <div style={{ flex: 1 }} />

                    <button
                        onClick={handleSubmitAnswer}
                        disabled={isSubmitting || !answer.trim()}
                        className="btn btn-primary"
                        style={{ minWidth: '200px' }}
                    >
                        {isSubmitting
                            ? 'Submitting...'
                            : currentQuestion < interview.questions.length - 1
                                ? 'Next Question →'
                                : 'Complete Interview ✓'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MockInterviewSession;
