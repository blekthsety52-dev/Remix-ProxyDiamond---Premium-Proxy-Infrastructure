import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Settings, 
  CreditCard, 
  Activity, 
  LogOut, 
  Diamond,
  Zap,
  Globe,
  Shield,
  Hammer,
  Link as LinkIcon,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  Key,
  MessageSquare
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../components/Tooltip';
import GeminiChat from '../components/GeminiChat';

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [backendUrl, setBackendUrl] = useState('');
  const [heroToken, setHeroToken] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [forgeStatus, setForgeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setBackendUrl(data.forgeConfig?.backendUrl || '');
          setHeroToken(data.forgeConfig?.heroToken || '');
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  const saveForgeConfig = async () => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, {
        forgeConfig: {
          backendUrl,
          heroToken
        }
      });
      setUserData({ ...userData, forgeConfig: { backendUrl, heroToken } });
    } catch (err) {
      console.error("Error saving forge config:", err);
    }
  };

  const testConnection = async () => {
    if (!backendUrl) return;
    setTestStatus('loading');
    setTestResult(null);
    try {
      const response = await fetch(backendUrl);
      const data = await response.json();
      setTestResult(data);
      setTestStatus('success');
    } catch (err) {
      console.error("Connection failed:", err);
      setTestStatus('error');
    }
  };

  const forgeMagicLayer = async () => {
    if (!backendUrl) return;
    setForgeStatus('loading');
    try {
      const response = await fetch(`${backendUrl}/api/forge/magic-layer`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${heroToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: "Generate magic layer" })
      });
      if (!response.ok) throw new Error("Forge failed");
      setForgeStatus('success');
    } catch (err) {
      console.error("Forge failed:", err);
      setForgeStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-12">
          <div className="bg-cyan-500 p-1.5 rounded-lg">
            <Diamond className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">ProxyDiamond</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview' },
            { icon: <MessageSquare className="w-5 h-5" />, label: 'AI Assistant' },
            { icon: <Hammer className="w-5 h-5" />, label: 'Forge' },
            { icon: <Globe className="w-5 h-5" />, label: 'Proxies' },
            { icon: <Activity className="w-5 h-5" />, label: 'Usage' },
            { icon: <CreditCard className="w-5 h-5" />, label: 'Billing' },
            { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.label ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              {activeTab === 'Forge' ? 'Forge Integration' : 
               activeTab === 'AI Assistant' ? 'AI Assistant' :
               `Welcome back, ${userData?.displayName || 'User'}`}
            </h1>
            <p className="text-slate-500 mt-1">
              {activeTab === 'Forge' ? 'Connect your local backend via public tunnel.' : 
               activeTab === 'AI Assistant' ? 'Chat with our ProxyDiamond AI Expert.' :
               "Here's what's happening with your proxies today."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold">{userData?.email}</div>
              <div className="text-xs text-slate-500">Pro Plan</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cyan-400 font-bold">
                  {userData?.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  { label: 'Active Proxies', value: '42', icon: <Globe className="text-blue-400" />, trend: '+5%' },
                  { label: 'Data Used', value: '12.4 GB', icon: <Zap className="text-yellow-400" />, trend: '18% left' },
                  { label: 'Success Rate', value: '99.8%', icon: <Shield className="text-green-400" />, trend: 'Stable' },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-800 rounded-2xl">{stat.icon}</div>
                      <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{stat.trend}</span>
                    </div>
                    <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                <div className="space-y-6">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-slate-800 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                        <div>
                          <div className="text-sm font-bold">Proxy Rotation Successful</div>
                          <div className="text-xs text-slate-500">Gate: gate.proxydiamond.xo.je:8080</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">2 minutes ago</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'AI Assistant' && (
            <motion.div
              key="ai-assistant"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto"
            >
              <GeminiChat />
            </motion.div>
          )}

          {activeTab === 'Forge' && (
            <motion.div
              key="forge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-cyan-400" />
                  Tunnel Configuration
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Backend Tunnel URL (ngrok/localtunnel)</label>
                      <input 
                        type="text" 
                        value={backendUrl}
                        onChange={(e) => setBackendUrl(e.target.value)}
                        placeholder="https://your-tunnel-id.ngrok-free.app"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Hero Token (Authorization Bearer)</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                          type="password" 
                          value={heroToken}
                          onChange={(e) => setHeroToken(e.target.value)}
                          placeholder="ya29.a0Aa7..."
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={saveForgeConfig}
                      className="bg-cyan-500 text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-colors"
                    >
                      Save Configuration
                    </button>
                  </div>

                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Connection Test</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3">
                          {testStatus === 'loading' ? <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" /> : 
                           testStatus === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                           testStatus === 'error' ? <XCircle className="w-5 h-5 text-red-500" /> :
                           <Globe className="w-5 h-5 text-slate-500" />}
                          <span className="text-sm font-medium">Backend Status</span>
                        </div>
                        <button 
                          onClick={testConnection}
                          disabled={!backendUrl || testStatus === 'loading'}
                          className="text-xs font-bold text-cyan-400 hover:underline disabled:opacity-50"
                        >
                          Run Test
                        </button>
                      </div>
                      
                      {testResult && (
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-cyan-400">
                          <pre>{JSON.stringify(testResult, null, 2)}</pre>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3">
                          {forgeStatus === 'loading' ? <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" /> : 
                           forgeStatus === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                           forgeStatus === 'error' ? <XCircle className="w-5 h-5 text-red-500" /> :
                           <Zap className="w-5 h-5 text-slate-500" />}
                          <span className="text-sm font-medium">Magic Layer Forge</span>
                        </div>
                        <button 
                          onClick={forgeMagicLayer}
                          disabled={!backendUrl || !heroToken || forgeStatus === 'loading'}
                          className="text-xs font-bold text-cyan-400 hover:underline disabled:opacity-50"
                        >
                          Execute
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                  <h3 className="text-lg font-bold mb-4">Setup Instructions</h3>
                  <ul className="space-y-4 text-sm text-slate-400">
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white shrink-0">1</span>
                      <p>Run <code className="text-cyan-400">ngrok http 8000</code> on your local machine.</p>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white shrink-0">2</span>
                      <p>Ensure your FastAPI backend has <code className="text-cyan-400">CORSMiddleware</code> configured for this origin.</p>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white shrink-0">3</span>
                      <p>Paste the Forwarding URL and your Hero Token above.</p>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                  <h3 className="text-lg font-bold mb-4">Why Forge?</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    The Forge integration allows you to bridge the gap between AI Studio's cloud capabilities and your local hardware. Execute complex automation, generate AI media, and manage your local environment directly from this dashboard.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
