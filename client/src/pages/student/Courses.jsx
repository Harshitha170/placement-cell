import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import '../../App.css';

const Courses = () => {
    const { user } = useAuth();
    const [courses, setcourses] = useState([]);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({
        category: '',
        difficulty: '',
        provider: '',
        search: ''
    });
    const [activeTab, setActiveTab] = useState('recommended');

    useEffect(() => {
        fetchRecommendedCourses();
        fetchAllCourses();
    }, []);

    const fetchRecommendedCourses = async () => {
        try {
            const response = await api.get('/courses/recommended');
            setRecommendedCourses(response.data.data);
        } catch (err) {
            console.error('Error fetching recommended courses:', err);
        }
    };

    const fetchAllCourses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (filter.category) params.append('category', filter.category);
            if (filter.difficulty) params.append('difficulty', filter.difficulty);
            if (filter.provider) params.append('provider', filter.provider);
            if (filter.search) params.append('search', filter.search);

            const response = await api.get(`/courses?${params.toString()}`);
            setcourses(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch courses');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'all') {
            fetchAllCourses();
        }
    }, [filter]);

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    const resetFilters = () => {
        setFilter({
            category: '',
            difficulty: '',
            provider: '',
            search: ''
        });
    };

    const CourseCard = ({ course }) => (
        <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{course.title}</h3>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span className="badge" style={{ backgroundColor: '#3498db' }}>
                            {course.category}
                        </span>
                        <span className="badge" style={{ backgroundColor: getDifficultyColor(course.difficulty) }}>
                            {course.difficulty}
                        </span>
                        <span className="badge" style={{ backgroundColor: '#95a5a6' }}>
                            {course.provider}
                        </span>
                        {course.isFree && (
                            <span className="badge" style={{ backgroundColor: '#27ae60' }}>
                                FREE
                            </span>
                        )}
                    </div>

                    <p style={{ color: '#555', marginBottom: '15px', lineHeight: '1.6' }}>
                        {course.description}
                    </p>

                    <div style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#2c3e50' }}>Skills: </strong>
                        <span style={{ color: '#7f8c8d' }}>
                            {course.skills.slice(0, 5).join(', ')}
                            {course.skills.length > 5 && '...'}
                        </span>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#2c3e50' }}>Relevant for: </strong>
                        <span style={{ color: '#7f8c8d' }}>
                            {course.jobRoles.slice(0, 3).join(', ')}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', color: '#7f8c8d', fontSize: '14px' }}>
                        <div>
                            ⭐ {course.rating}/5
                        </div>
                        <div>
                            📚 {course.duration}
                        </div>
                        <div>
                            👥 {formatEnrollments(course.enrollments)} learners
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                >
                    Start Learning →
                </a>
            </div>
        </div>
    );

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return '#27ae60';
            case 'Intermediate': return '#f39c12';
            case 'Advanced': return '#e74c3c';
            default: return '#95a5a6';
        }
    };

    const formatEnrollments = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <div className="container">
            <div style={{ marginBottom: '30px' }}>
                <h1>🎓 Learning Resources</h1>
                <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
                    Upskill yourself with free and premium courses tailored to your career goals
                </p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '30px',
                borderBottom: '2px solid #ecf0f1'
            }}>
                <button
                    onClick={() => setActiveTab('recommended')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: activeTab === 'recommended' ? '#3498db' : '#7f8c8d',
                        borderBottom: activeTab === 'recommended' ? '3px solid #3498db' : 'none',
                        marginBottom: '-2px'
                    }}
                >
                    ⭐ Recommended for You
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: activeTab === 'all' ? '#3498db' : '#7f8c8d',
                        borderBottom: activeTab === 'all' ? '3px solid #3498db' : 'none',
                        marginBottom: '-2px'
                    }}
                >
                    📚 All Courses
                </button>
            </div>

            {/* Filters for All Courses Tab */}
            {activeTab === 'all' && (
                <div className="card" style={{ marginBottom: '30px' }}>
                    <h3 style={{ marginTop: 0 }}>🔍 Filters</h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '15px',
                        marginBottom: '15px'
                    }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                Search
                            </label>
                            <input
                                type="text"
                                name="search"
                                value={filter.search}
                                onChange={handleFilterChange}
                                placeholder="Search by title or skills..."
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                Category
                            </label>
                            <select
                                name="category"
                                value={filter.category}
                                onChange={handleFilterChange}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            >
                                <option value="">All Categories</option>
                                <option value="Programming">Programming</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Data Science">Data Science</option>
                                <option value="AI/ML">AI/ML</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Mobile Development">Mobile Development</option>
                                <option value="Cloud Computing">Cloud Computing</option>
                                <option value="Cybersecurity">Cybersecurity</option>
                                <option value="Soft Skills">Soft Skills</option>
                                <option value="Interview Prep">Interview Prep</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                Difficulty
                            </label>
                            <select
                                name="difficulty"
                                value={filter.difficulty}
                                onChange={handleFilterChange}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            >
                                <option value="">All Levels</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                Provider
                            </label>
                            <select
                                name="provider"
                                value={filter.provider}
                                onChange={handleFilterChange}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            >
                                <option value="">All Providers</option>
                                <option value="Coursera">Coursera</option>
                                <option value="Udemy">Udemy</option>
                                <option value="edX">edX</option>
                                <option value="YouTube">YouTube</option>
                                <option value="FreeCodeCamp">FreeCodeCamp</option>
                                <option value="LinkedIn Learning">LinkedIn Learning</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={resetFilters}
                        className="btn"
                        style={{ backgroundColor: '#95a5a6' }}
                    >
                        Reset Filters
                    </button>
                </div>
            )}

            {/* Course List */}
            {error && (
                <div className="error" style={{ marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                    Loading courses...
                </div>
            ) : (
                <>
                    {activeTab === 'recommended' && (
                        <>
                            {recommendedCourses.length === 0 ? (
                                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                                    <h3>📚 No Recommendations Yet</h3>
                                    <p style={{ color: '#7f8c8d' }}>
                                        Apply to some jobs first, and we'll recommend courses based on your interests!
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div style={{
                                        marginBottom: '20px',
                                        padding: '15px',
                                        backgroundColor: '#e8f5e9',
                                        borderRadius: '8px',
                                        borderLeft: '4px solid #27ae60'
                                    }}>
                                        <strong>💡 Personalized for You:</strong> These courses match your job applications and profile skills
                                    </div>
                                    {recommendedCourses.map(course => (
                                        <CourseCard key={course._id} course={course} />
                                    ))}
                                </>
                            )}
                        </>
                    )}

                    {activeTab === 'all' && (
                        <>
                            <div style={{ marginBottom: '20px', color: '#7f8c8d' }}>
                                Found {courses.length} courses
                            </div>
                            {courses.length === 0 ? (
                                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                                    <h3>No courses found</h3>
                                    <p style={{ color: '#7f8c8d' }}>
                                        Try adjusting your filters
                                    </p>
                                </div>
                            ) : (
                                courses.map(course => (
                                    <CourseCard key={course._id} course={course} />
                                ))
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Courses;
