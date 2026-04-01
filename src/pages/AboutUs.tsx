import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Globe, Users, History, Target } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="pt-32 pb-20 bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Our Mission & <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
              The ProxyDiamond Story
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl">
            Empowering the modern web with the most reliable, fast, and anonymous proxy infrastructure.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <History className="text-cyan-400" /> Our History
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Founded in 2024, ProxyDiamond began as a small project by a group of developers frustrated with the lack of reliable residential proxy providers. We saw a gap in the market for high-performance, ethically sourced IPs that could handle the demands of modern web scraping and automation.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Over the past two years, we've grown from a niche provider to a global leader, serving over 10,000 businesses worldwide. Our infrastructure has expanded to include 40M+ residential IPs across 190+ countries.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full" />
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
              alt="Team collaboration" 
              className="rounded-3xl border border-slate-800 relative z-10 shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              title: "Our Mission",
              icon: <Target className="w-8 h-8 text-cyan-400" />,
              desc: "To provide the most transparent and high-performance proxy network in the world, enabling data-driven decision making for everyone."
            },
            {
              title: "Global Reach",
              icon: <Globe className="w-8 h-8 text-blue-400" />,
              desc: "With IPs in every corner of the globe, we ensure our clients can access any content, anywhere, at any time."
            },
            {
              title: "Security First",
              icon: <ShieldCheck className="w-8 h-8 text-indigo-400" />,
              desc: "We prioritize user privacy and data security above all else, maintaining strict ethical standards for IP sourcing."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800">
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-bold mb-12 flex items-center justify-center gap-3">
            <Users className="text-cyan-400" /> Meet The Team
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Alex Rivers", role: "CEO & Founder", img: "https://i.pravatar.cc/150?u=alex" },
              { name: "Sarah Chen", role: "CTO", img: "https://i.pravatar.cc/150?u=sarah" },
              { name: "Marcus Thorne", role: "Head of Infrastructure", img: "https://i.pravatar.cc/150?u=marcus" },
              { name: "Elena Vance", role: "Customer Success", img: "https://i.pravatar.cc/150?u=elena" }
            ].map((member, idx) => (
              <div key={idx} className="group">
                <div className="relative mb-4 overflow-hidden rounded-2xl aspect-square">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">View Profile</span>
                  </div>
                </div>
                <h4 className="font-bold text-lg">{member.name}</h4>
                <p className="text-slate-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
