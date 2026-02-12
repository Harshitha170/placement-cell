import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            <polygon points="50,0 100,0 50,100 0,100" />
                        </svg>

                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl text-balance">
                                    <span className="block xl:inline">Building the</span>{' '}
                                    <span className="block text-primary-600 xl:inline">Career Bridge</span>{' '}
                                    <span className="block xl:inline">to Your Future</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Connect with top recruiters, prepare with AI-powered mock interviews, and track your professional progress all in one place.
                                </p>
                                {!user && (
                                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                        <div className="rounded-md shadow">
                                            <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105">
                                                Get Started
                                            </Link>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-3">
                                            <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105">
                                                Sign In
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="/hero.png" alt="Career Bridge Hero" />
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-white relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-50/50 rounded-full blur-3xl -z-10"></div>

                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">Powerful Features</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Everything you need to bridge the gap between education and your dream career.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    <div className="card group hover:border-blue-200 transition-all duration-300">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🎯</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Job Matching</h3>
                        <p className="text-gray-600 leading-relaxed">Find the perfect opportunities tailored to your unique skills and professional preferences.</p>
                    </div>

                    <div className="card group hover:border-teal-200 transition-all duration-300">
                        <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📅</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Smart Scheduling</h3>
                        <p className="text-gray-600 leading-relaxed">Seamlessly schedule and manage interviews with our integrated calendar system.</p>
                    </div>

                    <div className="card group hover:border-violet-200 transition-all duration-300">
                        <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📝</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">ATS Optimizer</h3>
                        <p className="text-gray-600 leading-relaxed">Optimize your resume for ATS systems with sophisticated AI-powered analysis.</p>
                    </div>

                    <div className="card group hover:border-amber-200 transition-all duration-300">
                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📚</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Industry Prep</h3>
                        <p className="text-gray-600 leading-relaxed">Access curated preparation notes and company-specific tips for every domain.</p>
                    </div>

                    <div className="card group hover:border-emerald-200 transition-all duration-300">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📊</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Live Analytics</h3>
                        <p className="text-gray-600 leading-relaxed">Track applications, interview performance, and placement stats in real-time.</p>
                    </div>

                    <div className="card group hover:border-primary-200 transition-all duration-300">
                        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🔒</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Secure Vault</h3>
                        <p className="text-gray-600 leading-relaxed">Advanced role-based access control ensuring your profile data remains private.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of students and recruiters already using our platform
                    </p>
                    {!user && (
                        <Link to="/register" className="btn-primary text-lg px-8 py-3">
                            Create Free Account
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
