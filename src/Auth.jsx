import { useState } from 'react';
import { Activity, CheckCircle2, Sparkles } from 'lucide-react';

async function derive(password, saltHex) {
  const salt = saltHex ? Uint8Array.from(saltHex.match(/.{1,2}/g).map(v => parseInt(v, 16))) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, key, 256);
  return {
    salt: Array.from(salt, v => v.toString(16).padStart(2, '0')).join(''),
    hash: Array.from(new Uint8Array(bits), v => v.toString(16).padStart(2, '0')).join('')
  };
}
function accounts() {
  try { return JSON.parse(localStorage.getItem('dashboard_accounts') || '[]'); }
  catch { return []; }
}
export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);\n  const fillAdminDemo = () => { setEmail('admin@dashboard.local'); setPassword('DashAdmin#2026'); setMode('login'); setError(''); };
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const normalized = email.trim().toLowerCase();
      const list = accounts().filter(a => a.email !== 'demo@dashboard.local');
      if (mode === 'register') {
        if (name.trim().length < 2) throw new Error('Enter your full name.');
        if (password.length < 8) throw new Error('Use a password with at least 8 characters.');
        if (password !== confirm) throw new Error('Your passwords do not match.');
        if (list.some(a => a.email === normalized)) throw new Error('An account with this email already exists.');
        const result = await derive(password);
        const account = { id: crypto.randomUUID(), name: name.trim(), email: normalized, role: normalized === 'admin@dashboard.local' ? 'admin' : 'user', ...result, createdAt: new Date().toISOString() };
        localStorage.setItem('dashboard_accounts', JSON.stringify([account, ...list]));
        onLogin({ id: account.id, name: account.name, email: account.email, role: account.role || 'user' });
      } else {
        if (normalized === 'admin@dashboard.local' && password === 'DashAdmin#2026') {
          onLogin({ id: 'dashboard-admin', name: 'Dashboard Administrator', email: normalized, role: 'admin' });
          return;
        }
        const account = list.find(a => a.email === normalized);
        if (!account) throw new Error('No account found. Create an account first.');
        const result = await derive(password, account.salt);
        if (result.hash !== account.hash) throw new Error('Incorrect email or password.');
        onLogin({ id: account.id, name: account.name, email: account.email });
      }
    } catch (err) { setError(err.message || 'Unable to continue. Please try again.'); }
    finally { setBusy(false); }
  }
  return <div className="auth-shell">
    <aside className="auth-aside">
      <div className="auth-brand"><div className="brand-mark"><Activity size={21}/></div><div><strong>dashboard</strong><small>BUSINESS WORKSPACE</small></div></div>
      <div className="auth-pitch"><span className="banner-kicker"><Sparkles size={14}/> YOUR BUSINESS, IN FOCUS</span><h1>Make space for<br/>better business.</h1><p>Keep customers, sales and everyday work organised in one clear workspace.</p>
        <div className="auth-feature"><CheckCircle2 size={17}/> One place for your business activity</div>
        <div className="auth-feature"><CheckCircle2 size={17}/> Simple sales and payment tracking</div>
        <div className="auth-feature"><CheckCircle2 size={17}/> Separate browser workspace for each account</div>
      </div><span className="auth-aside-foot">A clearer way to run your day.</span>
    </aside>
    <main className="auth-main"><form className="auth-card" onSubmit={submit}>
      <div className="auth-mobile-brand"><div className="brand-mark"><Activity size={20}/></div><b>dashboard</b></div>
      <span className="auth-overline">{mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</span>
      <h2>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</h2>
      <p className="auth-subtitle">{mode === 'login' ? 'Enter your details to access your business workspace.' : 'Set up your account to start managing your business.'}</p>
      {mode === 'register' && <label>Full name<input autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required/></label>}
      <label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required/></label>
      <label>Password<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'login' ? 'Enter your password' : 'At least 8 characters'} required minLength={8}/></label>
      {mode === 'register' && <label>Confirm password<input type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter your password" required minLength={8}/></label>}
      {mode === 'login' && <div style={{border:'1px solid #d9d7f5',background:'#f6f5ff',borderRadius:12,padding:14,margin:'4px 0 14px',fontSize:13}}><b style={{display:'block',marginBottom:6}}>Demo administrator account</b><div>Email: <code>admin@dashboard.local</code></div><div>Password: <code>DashAdmin#2026</code></div><button type="button" onClick={fillAdminDemo} style={{marginTop:10,border:0,background:'#23212c',color:'#fff',padding:'8px 12px',borderRadius:8,cursor:'pointer'}}>Fill admin login</button><small style={{display:'block',marginTop:8,color:'#666'}}>Prototype access only — browser-based and not production-secure.</small></div>}\n      {error && <div className="auth-error">{error}</div>}
      <button className="btn btn-primary auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
      <div className="auth-switch">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'}<button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></div>
    </form><span className="auth-legal">Your workspace data is stored in this browser only.</span></main>
  </div>;
}
