import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Mail, ShieldCheck, FileCheck2, UserCheck, Sparkles,
  Pencil, Copy, Check, FlaskConical, Settings,
  Play, Square, Loader2, AlertTriangle,
} from 'lucide-react';
import EmailConfigModal from '../components/EmailConfigModal';

const STORAGE_KEY = 'ng_email_watcher_config';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function fmtTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

// Mirrors backend EmailSettings defaults (backend/email_watcher/config.py).
const DEFAULT_CONFIG = {
  provider: 'imap',
  pollInterval: 60,
  expectedSubject: 'Pre-Work Submission',
  filenameRegex: '^ng_([a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*)\\.pdf$',
  defaultTrack: 'ai',
  defaultEvalType: 'prework',
  imapHost: 'imap.gmail.com',
  imapPort: 993,
  imapMailbox: 'INBOX',
  gmailAddress: '',
  gmailAppPassword: '',
  gmailApiCredentialsPath: 'credentials.json',
  gmailApiTokenPath: 'token.json',
  gmailUserId: 'me',
};

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

// Mirrors backend extract_candidate_name(): group(1) -> "_"->space, title-case.
function testFilename(name, regexStr) {
  if (!name.trim()) return null;
  try {
    const re = new RegExp(regexStr, 'i');
    const m = name.trim().match(re);
    if (!m) return { ok: false };
    const candidate = (m[1] || '')
      .split(/[_\s]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    return { ok: true, candidate };
  } catch {
    return { ok: false, error: 'Invalid regex' };
  }
}

function buildEnv(c) {
  const lines = [
    '# Email Intake Worker (backend/email_watcher)',
    `EMAIL_PROVIDER=${c.provider}`,
    `EMAIL_POLL_INTERVAL=${c.pollInterval}`,
    `EMAIL_EXPECTED_SUBJECT=${c.expectedSubject}`,
    `EMAIL_FILENAME_REGEX=${c.filenameRegex}`,
    `DEFAULT_EMAIL_TRACK=${c.defaultTrack}`,
    `DEFAULT_EMAIL_EVAL_TYPE=${c.defaultEvalType}`,
  ];
  if (c.provider === 'imap') {
    lines.push(
      '', '# IMAP provider',
      `IMAP_HOST=${c.imapHost}`,
      `IMAP_PORT=${c.imapPort}`,
      `IMAP_MAILBOX=${c.imapMailbox}`,
      `GMAIL_ADDRESS=${c.gmailAddress}`,
      `GMAIL_APP_PASSWORD=${c.gmailAppPassword}`,
    );
  } else {
    lines.push(
      '', '# Gmail API provider',
      `GMAIL_API_CREDENTIALS_PATH=${c.gmailApiCredentialsPath}`,
      `GMAIL_API_TOKEN_PATH=${c.gmailApiTokenPath}`,
      `GMAIL_USER_ID=${c.gmailUserId}`,
    );
  }
  return lines.join('\n');
}

const FLOW_STEPS = [
  { icon: Mail, label: 'Detect email', desc: 'Subject matches' },
  { icon: FileCheck2, label: 'Validate PDF', desc: 'One readable PDF' },
  { icon: ShieldCheck, label: 'Check naming', desc: 'ng_<name>.pdf' },
  { icon: UserCheck, label: 'Extract name', desc: 'From filename' },
  { icon: Sparkles, label: 'Auto-evaluate', desc: 'DeepSeek pipeline' },
];

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-slate-500">{label}</span>
      <span className={`text-white font-medium text-right break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}

export default function ConfigPage() {
  const [config, setConfig] = useState(loadConfig);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testName, setTestName] = useState('ng_aniket.pdf');

  const [worker, setWorker] = useState(null);     // status payload, null until first fetch
  const [workerBusy, setWorkerBusy] = useState(false);
  const [workerErr, setWorkerErr] = useState('');
  const [online, setOnline] = useState(true);

  const envText = useMemo(() => buildEnv(config), [config]);
  const result = useMemo(() => testFilename(testName, config.filenameRegex), [testName, config.filenameRegex]);

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/worker/status`);
      if (!res.ok) throw new Error();
      setWorker(await res.json());
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, []);

  // Poll worker status every 5s while the page is open.
  // (refreshStatus only setStates after an awaited fetch, never synchronously.)
  useEffect(() => {
    const id = setInterval(refreshStatus, 5000);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshStatus();
    return () => clearInterval(id);
  }, [refreshStatus]);

  const running = !!worker?.running;

  const toggleWorker = async () => {
    setWorkerBusy(true);
    setWorkerErr('');
    try {
      const path = running ? 'stop' : 'start';
      const res = await fetch(`${API_BASE}/api/worker/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: running ? null : JSON.stringify(config),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setWorkerErr(data.detail || `Failed to ${path} worker.`);
      } else {
        setWorker(data);
        setOnline(true);
      }
    } catch {
      setWorkerErr('Cannot reach the backend at ' + API_BASE);
      setOnline(false);
    } finally {
      setWorkerBusy(false);
    }
  };

  const handleSave = (next) => {
    setConfig(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* localStorage unavailable — keep in-memory only */
    }
    setModalOpen(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(envText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="w-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-3">
            <Settings className="w-3.5 h-3.5" /> Automation
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Auto-Evaluation{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Pipeline</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            Configure the worker that watches a Gmail inbox and automatically evaluates emailed pre-work submissions.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 shadow-xl shadow-indigo-600/10 cursor-pointer transition-all shrink-0"
        >
          <Pencil className="w-4 h-4" /> Edit configuration
        </button>
      </div>

      {/* Flow steps */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {FLOW_STEPS.map((s, i) => (
          <div key={s.label} className="p-4 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><s.icon className="w-4 h-4" /></div>
              <span className="text-[10px] font-black text-slate-600">0{i + 1}</span>
            </div>
            <p className="text-xs font-bold text-white">{s.label}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Worker control */}
      <div className="mb-6 p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`relative flex h-3 w-3 ${running ? '' : 'opacity-60'}`}>
              {running && <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${running ? 'bg-emerald-400' : online ? 'bg-slate-500' : 'bg-amber-400'}`} />
            </span>
            <div>
              <h3 className="text-sm font-black text-white">
                Worker {running ? 'running' : online ? 'stopped' : 'backend offline'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {running
                  ? `Polling ${worker?.mailbox || worker?.provider || ''} every ${worker?.poll_interval}s`
                  : online
                  ? 'Not watching the inbox. Start to begin processing emails.'
                  : `No response from ${API_BASE}`}
              </p>
            </div>
          </div>
          <button
            onClick={toggleWorker}
            disabled={workerBusy || !online}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all shrink-0 ${
              !online
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : running
                ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:opacity-90 shadow-lg shadow-red-600/20 cursor-pointer'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 shadow-lg shadow-emerald-600/20 cursor-pointer'
            }`}
          >
            {workerBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : running ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {workerBusy ? 'Working…' : running ? 'Stop worker' : 'Start worker'}
          </button>
        </div>

        {workerErr && (
          <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-red-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{workerErr}</span>
          </div>
        )}

        {running && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              ['Started', fmtTime(worker?.started_at)],
              ['Last cycle', fmtTime(worker?.last_cycle_at)],
              ['Cycles', worker?.cycles ?? 0],
              ['Submissions', worker?.processed_total ?? 0],
            ].map(([label, val]) => (
              <div key={label} className="p-3 rounded-xl bg-slate-950/50 border border-white/[0.04]">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</p>
                <p className="text-xs text-white font-medium mt-1 break-all">{val}</p>
              </div>
            ))}
          </div>
        )}
        {!running && worker?.last_error && (
          <p className="mt-3 text-[11px] text-amber-300/80">Last error: {worker.last_error}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current configuration */}
        <div className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm">
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4">Current configuration</h3>
          <div className="text-xs divide-y divide-white/[0.04]">
            <Row label="Provider" value={config.provider === 'imap' ? 'IMAP (App Password)' : 'Gmail API (OAuth2)'} />
            <Row label="Poll interval" value={`${config.pollInterval}s`} />
            <Row label="Expected subject" value={config.expectedSubject} />
            <Row label="Filename regex" value={config.filenameRegex} mono />
            <Row label="Default track" value={config.defaultTrack} />
            <Row label="Evaluation type" value={config.defaultEvalType} />
            {config.provider === 'imap' ? (
              <>
                <Row label="Mailbox" value={`${config.imapHost} · ${config.imapMailbox}`} />
                <Row label="Gmail address" value={config.gmailAddress || '— not set —'} />
                <Row label="App password" value={config.gmailAppPassword ? '•••••••• set' : '— not set —'} />
              </>
            ) : (
              <>
                <Row label="Credentials" value={config.gmailApiCredentialsPath} mono />
                <Row label="Token" value={config.gmailApiTokenPath} mono />
                <Row label="User ID" value={config.gmailUserId} />
              </>
            )}
          </div>
        </div>

        {/* Filename validator */}
        <div className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Test the naming convention</h3>
          </div>
          <p className="text-[11px] text-slate-500 mb-4">
            Type an attachment filename to check it against the current regex — exactly as the worker would.
          </p>
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="ng_aniket.pdf"
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-indigo-500 text-slate-200 transition-colors"
          />
          <div className="mt-4">
            {!result && <p className="text-xs text-slate-600">Enter a filename above.</p>}
            {result?.error && (
              <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-red-300">{result.error}</div>
            )}
            {result && !result.error && result.ok && (
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Accepted → candidate <span className="font-bold text-emerald-200">{result.candidate}</span></span>
              </div>
            )}
            {result && !result.error && !result.ok && (
              <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-red-300">
                Rejected — does not match the naming convention (would be logged and skipped).
              </div>
            )}
          </div>
        </div>
      </div>

      {/* .env snippet */}
      <div className="mt-6 p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Apply this configuration</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Paste into <span className="font-mono text-slate-300">backend/.env</span>, then restart the worker
              (<span className="font-mono text-slate-300">python -m email_watcher.runner</span>).
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="text-xs font-mono text-slate-300 bg-slate-950/80 border border-white/[0.06] rounded-xl p-4 overflow-x-auto whitespace-pre leading-relaxed">
{envText}
        </pre>
      </div>

      {modalOpen && (
        <EmailConfigModal
          initialConfig={config}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
