import { useState } from 'react';
import { X, ShieldAlert, Save } from 'lucide-react';

const inputCls =
  'w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 transition-colors';

function Field({ label, hint, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-bold text-slate-300">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}

export default function EmailConfigModal({ initialConfig, onSave, onClose }) {
  const [form, setForm] = useState(initialConfig);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  let regexValid = true;
  try {
    new RegExp(form.filenameRegex);
  } catch {
    regexValid = false;
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.06] sticky top-0 bg-[#0b0f19] z-10">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Email Intake Configuration</h2>
            <p className="text-xs text-slate-500 mt-0.5">Settings for the automated pre-work evaluation worker</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-6">
          {/* Detection */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Detection &amp; Processing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Provider" hint="How the worker connects to Gmail">
                <select value={form.provider} onChange={set('provider')} className={inputCls}>
                  <option value="imap">IMAP (App Password)</option>
                  <option value="gmail_api">Gmail API (OAuth2)</option>
                </select>
              </Field>
              <Field label="Poll interval (seconds)">
                <input type="number" min="10" value={form.pollInterval} onChange={set('pollInterval')} className={inputCls} />
              </Field>
            </div>
            <Field label="Expected subject" hint="Emails whose subject contains this phrase are processed">
              <input type="text" value={form.expectedSubject} onChange={set('expectedSubject')} className={inputCls} />
            </Field>
            <Field
              label="Filename regex"
              hint={regexValid ? 'Convention for valid attachments, e.g. ng_<name>.pdf' : '⚠ Invalid regular expression'}
            >
              <input
                type="text"
                value={form.filenameRegex}
                onChange={set('filenameRegex')}
                className={`${inputCls} font-mono text-xs ${regexValid ? '' : 'border-red-500/60'}`}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Default track" hint="Track is not parsed from the email">
                <select value={form.defaultTrack} onChange={set('defaultTrack')} className={inputCls}>
                  <option value="ai">AI Engineer</option>
                  <option value="ml">ML Engineer</option>
                  <option value="fullstack">Full Stack</option>
                </select>
              </Field>
              <Field label="Evaluation type">
                <select value={form.defaultEvalType} onChange={set('defaultEvalType')} className={inputCls}>
                  <option value="prework">Pre-Work</option>
                  <option value="resume">Resume</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Provider-specific */}
          {form.provider === 'imap' ? (
            <section className="space-y-4">
              <h3 className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">IMAP Connection</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="IMAP host"><input type="text" value={form.imapHost} onChange={set('imapHost')} className={inputCls} /></Field>
                <Field label="IMAP port"><input type="number" value={form.imapPort} onChange={set('imapPort')} className={inputCls} /></Field>
                <Field label="Mailbox"><input type="text" value={form.imapMailbox} onChange={set('imapMailbox')} className={inputCls} /></Field>
                <Field label="Gmail address"><input type="email" placeholder="inbox@gmail.com" value={form.gmailAddress} onChange={set('gmailAddress')} className={inputCls} /></Field>
              </div>
              <Field label="Gmail App Password" hint="Create at myaccount.google.com/apppasswords (requires 2FA)">
                <input type="password" placeholder="16-character app password" value={form.gmailAppPassword} onChange={set('gmailAppPassword')} className={inputCls} />
              </Field>
            </section>
          ) : (
            <section className="space-y-4">
              <h3 className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Gmail API (OAuth2)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Credentials path"><input type="text" value={form.gmailApiCredentialsPath} onChange={set('gmailApiCredentialsPath')} className={inputCls} /></Field>
                <Field label="Token path"><input type="text" value={form.gmailApiTokenPath} onChange={set('gmailApiTokenPath')} className={inputCls} /></Field>
              </div>
              <Field label="User ID" hint="Usually 'me'"><input type="text" value={form.gmailUserId} onChange={set('gmailUserId')} className={inputCls} /></Field>
            </section>
          )}

          {/* Security note */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-200/80">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
            <p className="text-[11px] leading-relaxed">
              Saved in this browser only (localStorage). Secrets like the app password are not encrypted —
              the real configuration belongs in <span className="font-mono text-amber-200">backend/.env</span>.
              Use the generated snippet to apply it.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-white/[0.06] sticky bottom-0 bg-[#0b0f19]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => regexValid && onSave(form)}
            disabled={!regexValid}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
              regexValid
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 shadow-lg shadow-indigo-600/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" /> Save configuration
          </button>
        </div>
      </div>
    </div>
  );
}
