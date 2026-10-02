import React, { useState } from 'react';
import { X, Database, Mail, ShieldCheck, Copy, Check, ExternalLink, Terminal } from 'lucide-react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'supabase' | 'mailgun' | 'google'>('supabase');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h2 className="text-lg font-bold">HNG15 Lesson 2 Integration Guide</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Step-by-step setup for Supabase, Mailgun, and Google Cloud Console OAuth
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'supabase'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>1. Supabase / Neon DB</span>
          </button>

          <button
            onClick={() => setActiveTab('mailgun')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'mailgun'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>2. Mailgun Emails</span>
          </button>

          <button
            onClick={() => setActiveTab('google')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'google'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. Google Cloud OAuth</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
                <h3 className="font-bold text-sm mb-1">Supabase Database Setup</h3>
                <p>
                  The project includes a ready-to-execute SQL file at{' '}
                  <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono">backend/schema.sql</code>{' '}
                  which creates tables for <code className="font-bold">products</code>,{' '}
                  <code className="font-bold">orders</code>, and <code className="font-bold">order_items</code> with RLS policies.
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-3 font-medium">
                <li className="pl-1">
                  Create a free project at{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline inline-flex items-center gap-0.5"
                  >
                    supabase.com <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li className="pl-1">
                  Go to <strong>SQL Editor</strong> in your Supabase dashboard and run the contents of{' '}
                  <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">backend/schema.sql</code>.
                </li>
                <li className="pl-1">
                  Navigate to <strong>Project Settings → API</strong> and copy your:
                  <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-slate-600 font-normal">
                    <li>Project URL (e.g. <code className="font-mono">https://xyz.supabase.co</code>)</li>
                    <li>Anon / Public Key</li>
                    <li>Service Role Secret (for secure backend inserts)</li>
                  </ul>
                </li>
                <li className="pl-1">
                  Add them to both <code className="bg-slate-100 px-1 rounded font-mono">backend/.env</code> and{' '}
                  <code className="bg-slate-100 px-1 rounded font-mono">frontend/.env</code>:
                  <pre className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto">
{`# backend/.env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# frontend/.env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`}
                  </pre>
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'mailgun' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-blue-900">
                <h3 className="font-bold text-sm mb-1">Mailgun Email Integration</h3>
                <p>
                  Upon completing checkout, our FastAPI backend generates a responsive HTML receipt and dispatches it via Mailgun's REST API.
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-3 font-medium">
                <li className="pl-1">
                  Sign up or log in at{' '}
                  <a
                    href="https://mailgun.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline inline-flex items-center gap-0.5"
                  >
                    mailgun.com <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li className="pl-1">
                  In Mailgun dashboard, go to <strong>Sending → Domains</strong> and find your Sandbox domain (e.g.{' '}
                  <code className="bg-slate-100 px-1 rounded font-mono">sandbox123.mailgun.org</code>) or your custom verified domain.
                </li>
                <li className="pl-1">
                  Go to <strong>API Keys</strong> and create/copy your Mailgun Sending API Key.
                </li>
                <li className="pl-1">
                  <strong>Important for Sandbox domains:</strong> Mailgun requires adding your recipient email to{' '}
                  <strong>Authorized Recipients</strong> in the Sandbox domain overview, or verifying a custom domain.
                </li>
                <li className="pl-1">
                  Put credentials in <code className="bg-slate-100 px-1 rounded font-mono">backend/.env</code>:
                  <pre className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto">
{`MAILGUN_API_KEY=key-xxxxxxxxxxxxxx
MAILGUN_DOMAIN=sandbox123.mailgun.org
MAILGUN_API_BASE_URL=https://api.mailgun.net/v3
MAILGUN_FROM_EMAIL=HNG Tech Shop <postmaster@sandbox123.mailgun.org>`}
                  </pre>
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900">
                <h3 className="font-bold text-sm mb-1">Google Cloud Console OAuth Setup</h3>
                <p>
                  Allows customers to authenticate with Google. Credentials are wired through Supabase Auth.
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-3 font-medium">
                <li className="pl-1">
                  Go to{' '}
                  <a
                    href="https://console.cloud.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline inline-flex items-center gap-0.5"
                  >
                    Google Cloud Console <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  and create or select a project.
                </li>
                <li className="pl-1">
                  Navigate to <strong>APIs & Services → OAuth consent screen</strong>:
                  <ul className="list-disc list-inside mt-1 ml-4 space-y-0.5 text-slate-600 font-normal">
                    <li>User Type: <strong>External</strong></li>
                    <li>App name: <strong>HNG Tech Shop</strong></li>
                    <li>Add your support email and developer email</li>
                  </ul>
                </li>
                <li className="pl-1">
                  Go to <strong>APIs & Services → Credentials → Create Credentials → OAuth client ID</strong>:
                  <ul className="list-disc list-inside mt-1 ml-4 space-y-0.5 text-slate-600 font-normal">
                    <li>Application type: <strong>Web application</strong></li>
                    <li>
                      Authorized redirect URIs: paste your Supabase Callback URI:
                      <div className="my-1.5 p-2 bg-slate-900 text-slate-200 rounded font-mono text-[10px]">
                        https://&lt;your-supabase-project-id&gt;.supabase.co/auth/v1/callback
                      </div>
                    </li>
                  </ul>
                </li>
                <li className="pl-1">
                  Copy the <strong>Client ID</strong> and <strong>Client Secret</strong> from Google Cloud Console.
                </li>
                <li className="pl-1">
                  In your <strong>Supabase Dashboard → Authentication → Providers → Google</strong>:
                  <ul className="list-disc list-inside mt-1 ml-4 space-y-0.5 text-slate-600 font-normal">
                    <li>Toggle Google to <strong>Enabled</strong></li>
                    <li>Paste your Client ID and Client Secret</li>
                    <li>Click <strong>Save</strong></li>
                  </ul>
                </li>
                <li className="pl-1">
                  That's it! Clicking "Sign in with Google" in the shop now launches the authentic Google OAuth flow!
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            HNG15 Lesson 2 Individual Assignment
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
