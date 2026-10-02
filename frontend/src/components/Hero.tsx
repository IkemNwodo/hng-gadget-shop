import React from 'react';
import { ArrowRight, Database, Mail, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-2xl border border-slate-800">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-1/4 -mt-12 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-12 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-blue-400 mb-6 backdrop-blur-sm">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span>New Spring Collection • Up to 25% Off</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Next-Gen Tech Gadgets <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300">
            Engineered For Performance
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
          Upgrade your workspace with flagship ultrabooks, noise-canceling acoustics, and smart wearables. Built with modern full-stack persistence and fast checkout.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Highlight Architecture Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 text-left">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Supabase / Neon DB</p>
              <p className="text-[11px] text-slate-400">Real-time SQL persistence & RLS</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Mailgun Integration</p>
              <p className="text-[11px] text-slate-400">Instant order confirmation emails</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Google OAuth 2.0</p>
              <p className="text-[11px] text-slate-400">Google Cloud Console Auth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
