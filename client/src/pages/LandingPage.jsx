import { Link } from 'react-router-dom';
import { Cloud, UserPlus, FileText, Search, CheckCircle } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const steps = [
  {
    icon: UserPlus,
    title: 'Register',
    description: 'Create an account and login to get started with ComplaintHub.',
  },
  {
    icon: FileText,
    title: 'Submit Complaint',
    description: 'Fill out the complaint form with details and submit it easily.',
  },
  {
    icon: Search,
    title: 'Track Status',
    description: 'Track your complaint status in real-time with our tracking system.',
  },
  {
    icon: CheckCircle,
    title: 'Get Resolution',
    description: 'Receive updates and get your complaints resolved faster.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1117]">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-2">
          <Cloud className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-heading">ComplaintHub</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm nav-link">
          <a href="#home">Home</a>
          <a href="#services">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-body hover:text-primary">
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Register
          </Link>
        </div>
      </nav>

      <section id="home" className="px-8 py-16 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Cloud-Based Complaint Management System
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            Easily register your complaints, track their status in real-time, and get them resolved faster with our modern cloud platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/login"
              state={{ redirect: '/register-complaint' }}
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Register Complaint
            </Link>
            <Link
              to="/track"
              className="px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            >
              Track Complaint
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 flex items-center justify-center">
            <div className="text-center">
              <Cloud className="w-24 h-24 text-primary mx-auto mb-4" />
              <p className="text-body font-medium">Submit & Track Complaints Online</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="page-bg px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-heading mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.title} className="surface p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-heading mb-2">{step.title}</h3>
                <p className="text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-sidebar text-gray-400 text-center py-8 text-sm">
        <p>&copy; 2026 ComplaintHub. Cloud-Based Complaint Management System.</p>
      </footer>
    </div>
  );
}
