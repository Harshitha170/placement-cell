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
    const [activeTab, setActiveTab] = useState('all');

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
    }, [filter, activeTab]);

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
        <div className="group relative bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] border border-primary-100 shadow-premium hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-200">
                                {course.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${course.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                course.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    'bg-rose-50 text-rose-600 border-rose-100'
                                }`}>
                                {course.difficulty}
                            </span>
                            {course.isFree && (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                                    FREE
                                </span>
                            )}
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase group-hover:text-primary-600 transition-colors">
                            {course.title}
                        </h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">
                            Provider: {course.provider}
                        </p>
                    </div>
                </div>

                <p className="text-slate-600 text-lg leading-relaxed font-medium mb-8 border-l-4 border-primary-100 pl-6 bg-primary-50/10 py-4 rounded-r-2xl">
                    {course.description}
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Target Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {course.skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 uppercase">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-200/20 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-4 opacity-70">Engagement Stats</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-2xl font-black text-primary-900">⭐ {course.rating}</p>
                                <p className="text-[8px] font-bold uppercase tracking-widest text-primary-500">Rating</p>
                            </div>
                            <div>
                                <p className="text-xl font-black text-primary-900">👥 {formatEnrollments(course.enrollments)}</p>
                                <p className="text-[8px] font-bold uppercase tracking-widest text-primary-500">Learners</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-primary-100 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary-600">
                            <span>Duration: {course.duration}</span>
                            <span className="text-emerald-500 font-bold">Verified</span>
                        </div>
                    </div>
                </div>

                <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-primary-900 hover:scale-105 transition-all w-full md:w-auto"
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

    function FeaturedCard({ id }) {
        return (
            <CourseCard course={{
                _id: id,
                title: 'System Design Interview Guide',
                category: 'Interview Prep',
                difficulty: 'Advanced',
                provider: 'YouTube Academy',
                isFree: true,
                description: 'Learn how to design large-scale systems. Prepare for the system design interview with industry-leading architectural patterns.',
                skills: ['System Design', 'Scalability', 'Distributed Systems'],
                jobRoles: ['Software Engineer', 'System Architect'],
                rating: 4.9,
                duration: '10 hours',
                enrollments: 500000,
                url: 'https://www.youtube.com/c/SystemDesignInterview'
            }} />
        );
    }

    return (
        <div className="relative min-h-screen bg-[#fcfdfe] overflow-hidden">
            {/* Professional Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-50/20 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 animate-in fade-in duration-700">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-primary-100">
                        <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse"></span>
                        Academic Excellence
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2 underline decoration-primary-400 decoration-8 underline-offset-8">Learning Vault</h1>
                    <p className="text-slate-500 font-medium text-lg italic mt-4">Upskill with elite resources curated for your career trajectory.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mb-12 border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab('recommended')}
                        className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'recommended' ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        ⭐ Recommended Courses
                        {activeTab === 'recommended' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'all' ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        📚 All Courses
                        {activeTab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-full"></div>}
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Library</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'recommended' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                        {recommendedCourses.length > 0 ? 'Verified Matches' : 'Career Accelerators'}
                                    </div>
                                    <p className="text-slate-500 font-medium italic">
                                        {recommendedCourses.length > 0
                                            ? 'Courses precision-matched to your resume intelligence and applications.'
                                            : 'Explore our top foundation courses across all streams below.'}
                                    </p>
                                </div>

                                {recommendedCourses.length === 0 ? (
                                    <div className="grid grid-cols-1 gap-8">
                                        {courses.slice(0, 5).map(course => <CourseCard key={course._id} course={course} />)}
                                        <div className="text-center py-10">
                                            <button
                                                onClick={() => setActiveTab('all')}
                                                className="text-primary-600 font-black uppercase text-[10px] tracking-widest border-b-2 border-primary-200 pb-1 hover:border-primary-500 transition-all"
                                            >
                                                View Full Stream Catalog →
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    recommendedCourses.map(course => <CourseCard key={course._id} course={course} />)
                                )}
                            </div>
                        )}

                        {activeTab === 'all' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {/* Filters for All Courses Tab */}
                                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-premium mb-12 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8 text-primary-50 text-7xl font-black opacity-20 pointer-events-none select-none">FILTER</div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center text-xl shadow-sm">🔍</div>
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Precision Filters</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Smart Search</label>
                                            <input
                                                type="text"
                                                name="search"
                                                value={filter.search}
                                                onChange={handleFilterChange}
                                                placeholder="Topic or Skill..."
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-400 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold placeholder:text-slate-300"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Stream</label>
                                            <select
                                                name="category"
                                                value={filter.category}
                                                onChange={handleFilterChange}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-400 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                                            >
                                                <option value="">All Streams</option>
                                                <option value="Programming">Programming</option>
                                                <option value="Web Development">Web Development</option>
                                                <option value="Interview Prep">Interview Prep</option>
                                                <option value="Data Science">Data Science</option>
                                                <option value="AI/ML">AI/ML</option>
                                                <option value="DevOps">DevOps</option>
                                                <option value="Mobile Development">Mobile Development</option>
                                                <option value="Cybersecurity">Cybersecurity</option>
                                                <option value="Soft Skills">Soft Skills</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Mastery</label>
                                            <select
                                                name="difficulty"
                                                value={filter.difficulty}
                                                onChange={handleFilterChange}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-400 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                                            >
                                                <option value="">All Tiers</option>
                                                <option value="Beginner">Initiate</option>
                                                <option value="Intermediate">Expert</option>
                                                <option value="Advanced">Elite</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Source</label>
                                            <select
                                                name="provider"
                                                value={filter.provider}
                                                onChange={handleFilterChange}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-400 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                                            >
                                                <option value="">Any Platform</option>
                                                <option value="YouTube">YouTube Academy</option>
                                                <option value="Coursera">Coursera Pro</option>
                                                <option value="Udemy">Udemy Mastery</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        onClick={resetFilters}
                                        className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-600 transition-all shadow-lg"
                                    >
                                        Reset Matrix
                                    </button>
                                </div>

                                <div style={{ marginBottom: '20px', color: '#7f8c8d' }} className="flex justify-between items-center px-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory: {courses.length} Resources</span>
                                </div>



                                {courses.length === 0 ? (
                                    <div className="bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 py-20 text-center">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">No Resources Found</h3>
                                        <p className="text-slate-500 font-medium max-w-sm mx-auto">Try adjusting your precision filters to expand your search.</p>
                                    </div>
                                ) : (
                                    courses.map(course => <CourseCard key={course._id} course={course} />)
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Courses;
