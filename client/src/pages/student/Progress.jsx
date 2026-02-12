import { useState, useEffect } from 'react';
import api from '../../api/axios';
import '../../App.css';

const Progress = () => {
    const [progress, setProgress] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [goalForm, setGoalForm] = useState({
        title: '',
        description: '',
        targetDate: ''
    });

    useEffect(() => {
        fetchProgress();
        fetchAnalytics();
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await api.get('/progress/my-progress');
            setProgress(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching progress:', error);
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/progress/analytics');
            setAnalytics(response.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            await api.post('/progress/goals', goalForm);
            setShowAddGoal(false);
            setGoalForm({ title: '', description: '', targetDate: '' });
            fetchProgress();
        } catch (error) {
            console.error('Error adding goal:', error);
            alert('Failed to add goal');
        }
    };

    const handleToggleGoal = async (goalId, completed) => {
        try {
            await api.put(`/progress/goals/${goalId}`, { completed: !completed });
            fetchProgress();
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Placed': return '#27ae60';
            case 'Offer Received': return '#2ecc71';
            case 'Interview Stage': return '#3498db';
            case 'Actively Searching': return '#f39c12';
            default: return '#95a5a6';
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Loading your progress...
                </div>
            </div>
        );
    }

    if (!progress) {
        return (
            <div className="container">
                <div className="card">
                    <h2>No progress data available</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div style={{ marginBottom: '30px' }}>
                <h1>📊 My Placement Progress</h1>
                <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
                    Track your journey from applications to placement
                </p>
            </div>

            {/* Placement Status */}
            <div className="card" style={{
                marginBottom: '30px',
                background: `linear-gradient(135deg, ${getStatusColor(progress.placementStatus)}22 0%, ${getStatusColor(progress.placementStatus)}44 100%)`,
                borderLeft: `4px solid ${getStatusColor(progress.placementStatus)}`
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>
                            Current Status
                        </div>
                        <h2 style={{ margin: 0, color: getStatusColor(progress.placementStatus) }}>
                            {progress.placementStatus}
                        </h2>
                    </div>
                    {analytics && (
                        <div style={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            color: getStatusColor(progress.placementStatus),
                            opacity: 0.3
                        }}>
                            {analytics.insights.performanceScore}
                        </div>
                    )}
                </div>
            </div>

            {/* Key Metrics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                {/* Applications */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <h3 style={{ marginTop: 0, opacity: 0.9 }}>📝 Applications</h3>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px' }}>
                        {progress.applicationStats.totalApplications}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                        <div>Pending: {progress.applicationStats.pending}</div>
                        <div>Shortlisted: {progress.applicationStats.shortlisted}</div>
                        <div>Rejected: {progress.applicationStats.rejected}</div>
                        <div>Offered: {progress.applicationStats.offered}</div>
                    </div>
                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                        Success Rate: {progress.applicationStats.successRate}%
                    </div>
                </div>

                {/* Interviews */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                    <h3 style={{ marginTop: 0, opacity: 0.9 }}>🎤 Interviews</h3>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px' }}>
                        {progress.interviewStats.totalInterviews}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                        <div>Scheduled: {progress.interviewStats.scheduled}</div>
                        <div>Completed: {progress.interviewStats.completed}</div>
                        <div>Cleared: {progress.interviewStats.cleared}</div>
                        <div>Failed: {progress.interviewStats.failed}</div>
                    </div>
                    {progress.interviewStats.averageScore > 0 && (
                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                            Average Score: {progress.interviewStats.averageScore}%
                        </div>
                    )}
                </div>

                {/* Mock Interviews */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                    <h3 style={{ marginTop: 0, opacity: 0.9 }}>🎯 Mock Interviews</h3>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px' }}>
                        {progress.mockInterviewStats.totalMocks}
                    </div>
                    <div style={{ fontSize: '14px' }}>
                        <div style={{ marginBottom: '8px' }}>
                            Average Score: {progress.mockInterviewStats.averageScore}%
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            Best Score: {progress.mockInterviewStats.bestScore}%
                        </div>
                        {progress.mockInterviewStats.improvementRate !== 0 && (
                            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                                Improvement: {progress.mockInterviewStats.improvementRate > 0 ? '+' : ''}{progress.mockInterviewStats.improvementRate}%
                            </div>
                        )}
                    </div>
                </div>

                {/* Resume */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                    <h3 style={{ marginTop: 0, opacity: 0.9 }}>📄 Resume</h3>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px' }}>
                        {progress.resumeStats.atsScore}%
                    </div>
                    <div style={{ fontSize: '14px' }}>
                        ATS Compatibility Score
                    </div>
                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.3)', fontSize: '14px' }}>
                        Versions: {progress.resumeStats.totalVersions}
                    </div>
                </div>
            </div>

            {/* Weekly Activity Chart */}
            {progress.weeklyActivity && progress.weeklyActivity.length > 0 && (
                <div className="card" style={{ marginBottom: '30px' }}>
                    <h2 style={{ marginTop: 0 }}>📈 Weekly Activity</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            minWidth: 'max-content',
                            padding: '20px 0'
                        }}>
                            {progress.weeklyActivity.slice(-8).map((week, idx) => {
                                const total = week.applications + week.interviews + week.mockInterviews;
                                const maxHeight = 150;

                                return (
                                    <div key={idx} style={{ textAlign: 'center', minWidth: '80px' }}>
                                        <div style={{
                                            height: maxHeight,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-end',
                                            marginBottom: '10px'
                                        }}>
                                            {week.mockInterviews > 0 && (
                                                <div
                                                    style={{
                                                        backgroundColor: '#3498db',
                                                        height: `${(week.mockInterviews / Math.max(total, 1)) * maxHeight}px`,
                                                        borderRadius: '4px 4px 0 0',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    title={`Mock Interviews: ${week.mockInterviews}`}
                                                />
                                            )}
                                            {week.interviews > 0 && (
                                                <div
                                                    style={{
                                                        backgroundColor: '#e74c3c',
                                                        height: `${(week.interviews / Math.max(total, 1)) * maxHeight}px`,
                                                        transition: 'all 0.3s'
                                                    }}
                                                    title={`Interviews: ${week.interviews}`}
                                                />
                                            )}
                                            {week.applications > 0 && (
                                                <div
                                                    style={{
                                                        backgroundColor: '#27ae60',
                                                        height: `${(week.applications / Math.max(total, 1)) * maxHeight}px`,
                                                        borderRadius: '0 0 4px 4px',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    title={`Applications: ${week.applications}`}
                                                />
                                            )}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                                            {week.week}
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>
                                            {total}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px', fontSize: '14px' }}>
                        <div><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#27ae60', borderRadius: '2px', marginRight: '5px' }}></span>Applications</div>
                        <div><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#e74c3c', borderRadius: '2px', marginRight: '5px' }}></span>Interviews</div>
                        <div><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#3498db', borderRadius: '2px', marginRight: '5px' }}></span>Mock Interviews</div>
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {analytics && analytics.insights.recommendations && analytics.insights.recommendations.length > 0 && (
                <div className="card" style={{ marginBottom: '30px' }}>
                    <h2 style={{ marginTop: 0 }}>💡 Recommendations</h2>
                    {analytics.insights.recommendations.map((rec, idx) => {
                        const priorityColors = {
                            high: '#e74c3c',
                            medium: '#f39c12',
                            low: '#3498db'
                        };

                        return (
                            <div
                                key={idx}
                                style={{
                                    padding: '15px',
                                    marginBottom: '10px',
                                    backgroundColor: `${priorityColors[rec.priority]}22`,
                                    borderLeft: `4px solid ${priorityColors[rec.priority]}`,
                                    borderRadius: '6px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span className="badge" style={{ backgroundColor: priorityColors[rec.priority], marginRight: '10px' }}>
                                            {rec.priority.toUpperCase()}
                                        </span>
                                        <span style={{ fontWeight: '500' }}>{rec.message}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Goals */}
            <div className="card" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>🎯 My Goals</h2>
                    <button
                        onClick={() => setShowAddGoal(true)}
                        className="btn btn-primary"
                    >
                        + Add Goal
                    </button>
                </div>

                {showAddGoal && (
                    <form onSubmit={handleAddGoal} style={{
                        marginBottom: '20px',
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                Goal Title
                            </label>
                            <input
                                type="text"
                                value={goalForm.title}
                                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                                required
                                placeholder="E.g., Get 10 interview calls"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                Description (Optional)
                            </label>
                            <textarea
                                value={goalForm.description}
                                onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                                placeholder="Add more details about this goal..."
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    minHeight: '80px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                Target Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={goalForm.targetDate}
                                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setShowAddGoal(false)}
                                className="btn"
                                style={{ backgroundColor: '#95a5a6' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Add Goal
                            </button>
                        </div>
                    </form>
                )}

                {progress.currentGoals && progress.currentGoals.length > 0 ? (
                    <div>
                        {progress.currentGoals.map((goal) => (
                            <div
                                key={goal._id}
                                style={{
                                    padding: '15px',
                                    marginBottom: '15px',
                                    border: '1px solid #ecf0f1',
                                    borderRadius: '8px',
                                    backgroundColor: goal.completed ? '#f1f8f4' : 'white',
                                    opacity: goal.completed ? 0.7 : 1
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'start', gap: '15px' }}>
                                    <input
                                        type="checkbox"
                                        checked={goal.completed}
                                        onChange={() => handleToggleGoal(goal._id, goal.completed)}
                                        style={{
                                            marginTop: '5px',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer'
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            margin: '0 0 10px 0',
                                            textDecoration: goal.completed ? 'line-through' : 'none',
                                            color: goal.completed ? '#95a5a6' : '#2c3e50'
                                        }}>
                                            {goal.title}
                                        </h3>
                                        {goal.description && (
                                            <p style={{ color: '#7f8c8d', margin: '0 0 10px 0' }}>
                                                {goal.description}
                                            </p>
                                        )}
                                        {goal.targetDate && (
                                            <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                                                🗓️ Target: {new Date(goal.targetDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
                        <p>No goals set yet. Add your first goal to track your progress!</p>
                    </div>
                )}
            </div>

            {/* Recent Timeline */}
            {progress.timeline && progress.timeline.length > 0 && (
                <div className="card">
                    <h2 style={{ marginTop: 0 }}>🕐 Recent Activity</h2>
                    <div>
                        {progress.timeline.slice(0, 10).map((event, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '15px 0',
                                    borderBottom: idx < 9 ? '1px solid #ecf0f1' : 'none',
                                    display: 'flex',
                                    gap: '15px'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: '#3498db22',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {event.event === 'Application' && '📝'}
                                    {event.event === 'Interview' && '🎤'}
                                    {event.event === 'Mock Interview' && '🎯'}
                                    {event.event === 'Course Enrolled' && '📚'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '500', color: '#2c3e50', marginBottom: '5px' }}>
                                        {event.description}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                                {event.status && (
                                    <span className="badge" style={{
                                        backgroundColor:
                                            event.status === 'Offered' ? '#27ae60' :
                                                event.status === 'Shortlisted' ? '#3498db' :
                                                    event.status === 'Pending' ? '#f39c12' :
                                                        '#95a5a6'
                                    }}>
                                        {event.status}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Progress;
