import React from 'react';
import { Share2, Shield, Lock, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConnectionsView: React.FC = () => {
  const { accounts, toggleConnectPlatform } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none font-sans">
      {/* Header */}
      <div className="bg-[#12121A] border border-purple-500/30 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight uppercase">Social Feeds & OAuth</h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Manage your connected social accounts via official OAuth 2.0 PKCE.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full font-bold font-mono">
          <Shield className="w-4 h-4" /> ZERO PASSWORD STORAGE POLICY
        </div>
      </div>

      {/* Platform Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className={`bg-[#12121A] border rounded-3xl p-6 transition shadow-xl relative flex flex-col justify-between ${
              acc.connected ? 'border-emerald-500/40' : 'border-white/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#08080C] border border-purple-500/30 flex items-center justify-center font-black text-xl text-white uppercase">
                  {acc.platform === 'x' ? '𝕏' : acc.platform === 'reddit' ? 'r/' : 'in'}
                </div>
                <span
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-full border font-mono ${
                    acc.connected
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {acc.connected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>

              <h3 className="text-lg font-black text-white font-heading uppercase">
                {acc.platform === 'x' ? 'X (Twitter)' : acc.platform === 'reddit' ? 'Reddit' : 'LinkedIn'}
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                {acc.connected ? acc.handle : 'Account disconnected'}
              </p>

              {/* Capability Matrix */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block font-heading">
                  SUPPORTED CAPABILITIES:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <span className={acc.capabilities.read ? 'text-emerald-400 font-medium' : 'text-zinc-600'}>
                    {acc.capabilities.read ? '✓ Read' : '× Read N/A'}
                  </span>
                  <span className={acc.capabilities.search ? 'text-emerald-400 font-medium' : 'text-zinc-600'}>
                    {acc.capabilities.search ? '✓ Search' : '× Search N/A'}
                  </span>
                  <span className={acc.capabilities.post ? 'text-emerald-400 font-medium' : 'text-zinc-600'}>
                    {acc.capabilities.post ? '✓ Post' : '× Post N/A'}
                  </span>
                  <span className={acc.capabilities.reply ? 'text-emerald-400 font-medium' : 'text-zinc-600'}>
                    {acc.capabilities.reply ? '✓ Reply' : '× Reply N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-[#A1A1AA]">
                {acc.connected ? `Synced ${acc.lastSynced}` : 'Not synchronized'}
              </span>

              <button
                onClick={() => toggleConnectPlatform(acc.platform)}
                className={`py-2.5 px-5 rounded-xl text-xs font-bold transition ${
                  acc.connected
                    ? 'bg-[#08080C] border border-white/10 text-rose-400 hover:bg-rose-950/30'
                    : 'bg-[#9333EA] hover:bg-[#A855F7] text-white shadow-md shadow-[#9333EA]/30'
                }`}
              >
                {acc.connected ? 'Disconnect' : 'Connect Account'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Architecture Explainer */}
      <div className="bg-[#12121A] border border-white/10 rounded-3xl p-6 space-y-3">
        <h3 className="text-sm font-black text-white font-heading uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#C084FC]" /> SECURITY & TOKEN ARCHITECTURE
        </h3>
        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          SocialSamurai uses server-side OAuth 2.0 PKCE token exchange. Access tokens are encrypted at rest using KMS-managed encryption keys. Frontend client code never handles raw secret tokens or user passwords.
        </p>
      </div>
    </div>
  );
};

