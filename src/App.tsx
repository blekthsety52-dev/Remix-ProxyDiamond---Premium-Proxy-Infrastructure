/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Server, 
  Diamond, 
  Check, 
  Menu, 
  X, 
  ArrowRight, 
  Cpu, 
  Lock, 
  ChevronRight,
  Headphones,
  Send,
  Loader2
} from 'lucide-react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Pages
import AboutUs from './pages/AboutUs';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

// Components
import ChatWidget from './components/ChatWidget';
import Tooltip from './components/Tooltip';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" />;

  return <>{children}</>;
}

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Features', href: '#features' },
    { name: 'About Us', href: '/about' },
  ];

  const services = [
    {
      title: "HTTP Proxies",
      description: "High-speed HTTP proxies optimized for seamless web scraping and high-volume browsing tasks.",
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      tag: "Fastest"
    },
    {
      title: "SOCKS5 Proxies",
      description: "Advanced SOCKS5 protocols for maximum compatibility across all UDP/TCP applications.",
      icon: <Server className="w-8 h-8 text-indigo-500" />,
      tag: "Secure"
    },
    {
      title: "Residential Proxies",
      description: "Elite residential IPs sourced from real devices for the highest success rates in the industry.",
      icon: <Diamond className="w-8 h-8 text-cyan-500" />,
      tag: "Premium"
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "9.99",
      features: ["10 Premium Proxies", "1 Gbps Dedicated Speed", "24/7 Standard Support", "HTTP/SOCKS5 Support", "Unlimited Bandwidth"],
      color: "blue",
      popular: false
    },
    {
      name: "Professional",
      price: "29.99",
      features: ["50 Premium Proxies", "5 Gbps Dedicated Speed", "Priority Ticket Support", "Advanced Rotation Control", "API Access Included"],
      color: "indigo",
      popular: true
    },
    {
      name: "Enterprise",
      price: "99.99",
      features: ["Unlimited Proxies", "10 Gbps Dedicated Speed", "Dedicated Account Manager", "Custom Infrastructure", "SLA Guarantee"],
      color: "cyan",
      popular: false
    }
  ];

  const stats = [
    { label: "Global Locations", value: "190+" },
    { label: "IP Pool Size", value: "40M+" },
    { label: "Uptime", value: "99.9%" },
    { label: "Avg. Latency", value: "<50ms" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 font-sans">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Diamond className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ProxyDiamond
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a key={link.name} href={link.href} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} to={link.href} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  {link.name}
                </Link>
              )
            ))}
            <Tooltip content="Access your proxy dashboard">
              <button 
                onClick={() => navigate('/auth')}
                className="bg-white text-slate-950 px-5 py-2 rounded-full text-sm font-bold hover:bg-cyan-400 transition-colors"
              >
                Get Started
              </button>
            </Tooltip>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-950 pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <a key={link.name} href={link.href} className="text-2xl font-semibold" onClick={() => setMobileMenuOpen(false)}>
                    {link.name}
                  </a>
                ) : (
                  <Link key={link.name} to={link.href} className="text-2xl font-semibold" onClick={() => setMobileMenuOpen(false)}>
                    {link.name}
                  </Link>
                )
              ))}
              <button onClick={() => navigate('/auth')} className="w-full bg-cyan-500 py-4 rounded-xl font-bold text-lg">
                Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-slate-900 border border-slate-800 rounded-full text-cyan-400">
              Reliable • Fast • Anonymous
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Premium Proxy <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
                Performance Redefined
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-10">
              Deploy high-performance proxies in seconds. Scale your automation with 
              residential and datacenter networks that never sleep.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Tooltip content="Start your 7-day free trial">
                <button onClick={() => navigate('/auth')} className="w-full sm:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105">
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </button>
              </Tooltip>
              <Tooltip content="Read our technical guides">
                <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  View Documentation
                </button>
              </Tooltip>
            </div>
          </motion.div>

          {/* Hero Image Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 overflow-hidden backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="bg-slate-800 px-3 py-1 rounded text-[10px] text-slate-400 ml-4">
                  terminal — proxy_manager.sh
                </div>
              </div>
              <div className="text-left font-mono text-sm text-cyan-400/80 space-y-2">
                <p>$ curl --proxy "http://diamond-res:pass@gate.proxydiamond.xo.je:8080" https://api.ipify.org</p>
                <p className="text-slate-500">Connecting to ProxyDiamond Global Network...</p>
                <p className="text-green-400">Success! Current IP: 185.23.44.102 (Location: London, UK)</p>
                <p className="text-slate-500">Latency: 12ms | Speed: 942.4 Mbps</p>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-900 bg-slate-950/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Elite Infrastructure</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our diverse proxy networks are designed to handle everything from price comparison to social media management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-all group"
              >
                <div className="mb-6 p-4 bg-slate-800 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-2 block">
                  {service.tag}
                </span>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  {service.description}
                </p>
                <Tooltip content={`Explore our ${service.title} features`}>
                  <a href="#" className="flex items-center gap-2 text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                    Learn More <ChevronRight className="w-4 h-4" />
                  </a>
                </Tooltip>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section id="features" className="py-24 bg-slate-900/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6">Why Choose ProxyDiamond?</h2>
              <div className="space-y-6">
                {[
                  { icon: <Zap className="text-yellow-500" />, title: "Instant Delivery", desc: "Get access to your proxies immediately after purchase with no manual activation." },
                  { icon: <Lock className="text-green-500" />, title: "Total Privacy", desc: "We never log your traffic or personal data. Your browsing remains yours alone." },
                  { icon: <Cpu className="text-purple-500" />, title: "Smart Rotation", desc: "Automated IP rotation based on your custom requirements and success rates." },
                  { icon: <Headphones className="text-blue-500" />, title: "Expert Support", desc: "24/7 access to our engineering team for complex integration assistance." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1000" 
                alt="Datacenter" 
                className="rounded-3xl border border-slate-800 relative z-10 shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Flexible Pricing</h2>
            <p className="text-slate-400">Scale your operations with plans that grow with you.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative p-8 rounded-3xl border ${plan.popular ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500 shadow-[0_0_40px_-15px_rgba(6,182,212,0.3)]' : 'bg-slate-900/40 border-slate-800'} transition-all hover:scale-[1.02]`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-400 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">${plan.price}</span>
                    <span className="text-slate-500 font-medium">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className={`p-1 rounded-full ${plan.popular ? 'bg-cyan-500/20 text-cyan-500' : 'bg-slate-800 text-slate-500'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Tooltip content={`Subscribe to the ${plan.name} plan`}>
                  <button onClick={() => navigate('/auth')} className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                    Choose {plan.name}
                  </button>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">Ready to Secure Your Data?</h2>
              <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                Join 10,000+ businesses using ProxyDiamond for their mission-critical operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Tooltip content="Get immediate access">
                  <button onClick={() => navigate('/auth')} className="px-10 py-5 bg-white text-blue-800 font-black rounded-2xl hover:bg-blue-50 transition-colors shadow-xl">
                    Get Started Now
                  </button>
                </Tooltip>
                <Tooltip content="Talk to our team">
                  <button className="px-10 py-5 bg-blue-700/50 text-white font-bold rounded-2xl border border-blue-400/30 hover:bg-blue-700 transition-colors">
                    Contact Sales
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <footer className="py-12 border-t border-slate-900 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-cyan-500 p-1.5 rounded-lg">
                <Diamond className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">ProxyDiamond</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed mb-8">
              The world's most reliable proxy infrastructure for scraping, SEO, and anonymous browsing. Empowering data-driven companies since 2024.
            </p>
            
            {/* Subscription Form */}
            <div className="max-w-sm">
              <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-slate-400">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <Tooltip content="Join our mailing list">
                  <button 
                    disabled={status === 'loading'}
                    className="bg-cyan-500 text-slate-950 p-3 rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50"
                  >
                    {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </Tooltip>
              </form>
              {status === 'success' && <p className="text-green-400 text-xs mt-2">Thanks for subscribing!</p>}
              {status === 'error' && <p className="text-red-400 text-xs mt-2">Something went wrong. Try again.</p>}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><Tooltip content="High-speed residential IPs"><a href="#" className="hover:text-cyan-400 transition-colors">Residential Proxies</a></Tooltip></li>
              <li><Tooltip content="Reliable datacenter nodes"><a href="#" className="hover:text-cyan-400 transition-colors">Datacenter Proxies</a></Tooltip></li>
              <li><Tooltip content="Real mobile device IPs"><a href="#" className="hover:text-cyan-400 transition-colors">Mobile Proxies</a></Tooltip></li>
              <li><Tooltip content="Developer documentation"><a href="#" className="hover:text-cyan-400 transition-colors">API Reference</a></Tooltip></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><Tooltip content="Learn about our story"><Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></Tooltip></li>
              <li><Tooltip content="Our data protection policy"><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></Tooltip></li>
              <li><Tooltip content="Our service agreement"><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></Tooltip></li>
              <li><Tooltip content="Check network status"><a href="#" className="hover:text-cyan-400 transition-colors">Status Page</a></Tooltip></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-900 gap-4">
          <p className="text-slate-600 text-sm">
            &copy; 2026 ProxyDiamond. All rights reserved. Built for the modern web.
          </p>
          <div className="flex gap-6">
            {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
              <Tooltip key={social} content={`Follow us on ${social}`}>
                <a href="#" className="text-slate-600 hover:text-white transition-colors text-sm font-medium">
                  {social}
                </a>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
      <ChatWidget />
    </BrowserRouter>
  );
}
