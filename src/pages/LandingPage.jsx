import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center">
                {/* Hero Section */}
                <div className="mb-12 animate-in fade-in duration-1000">
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
                        MailPortal
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-4 font-light">
                        Your modern email experience
                    </p>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Manage all your emails in one beautiful, intuitive interface.
                        Fast, secure, and designed for productivity.
                    </p>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="text-4xl mb-3">⚡</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
                        <p className="text-white/70">Instant search and navigation</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="text-4xl mb-3">🎨</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Beautiful Design</h3>
                        <p className="text-white/70">Clean, modern interface</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="text-4xl mb-3">🔒</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Secure</h3>
                        <p className="text-white/70">Your data, protected</p>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => navigate('/login')}
                    className="group relative px-12 py-4 bg-white text-purple-600 rounded-full text-lg font-semibold hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-white/50 hover:scale-105"
                >
                    <span className="relative z-10">Go to App →</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>

                {/* Footer */}
                <p className="mt-12 text-white/50 text-sm">
                    © 2026 MailPortal. Built with ❤️
                </p>
            </div>
        </div>
    );
}
