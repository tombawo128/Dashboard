import { useState } from 'react';
import { Activity, CheckCircle2, Sparkles } from 'lucide-react';

async function derive(password, saltHex) {
  const salt = saltHex
    ? Uint8Array.from(saltHex.match(/.{1,2}/g).map(v => parseInt(v, 16)))
    : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, key, 256);
  return {
    salt: Array.from(salt, v => v.toString(16).padStart(2, '0')).join(''),
    hash: Array.from(new Uint8Array(bits), v => v.toString(16).padStart(2, '0')).join('')
  };
}

function accounts() {
  try {
    const value = JSON.parse(localStorage.getItem('dashboard_accounts') || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const normalized = email.trim().toLowerCase();
      if (!normalized || !password) throw new Error('Enter your email and password.');
      const list = accounts();

      if (mode === 'register') {
        if (name.trim().length < 2) throw new Error('Enter your full name.');
        if (password.length < 8) throw new Error('Use a password with at least 8 characters.');
        if (password !== confirm) throw new Error('Your passwords do not match.');
        if (list.some(account => account.email?.toLowerCase() === normalized)) {
          throw new Error('An account with this email already exists. Sign in instead.');
        }

        const credentials = await derive(password);
        const account = {
          id: crypto.randomUUID(),
          name: name.trim(),
          email: normalized,
          role: normalized === 'admin@dashboard.local' ? 'admin' : 'user',
          ...credentials,
          createdAt: new Date().toISOString()
        };
        const nextAccounts = [account, ...list];
        localStorage.setItem('dashboard_accounts', JSON.stringify(nextAccounts));
        onLogin({ id: account.id, name: account.name, email: account.email, role: account.role });
        return;
      }

      const account = list.find(item => item.email?.toLowerCase() === normalized);
      if (!account) throw new Error('No account found. Create an account first.');
      if (!account.salt || !account.hash) throw new Error('This account needs to be recreated. Please register again.');
      const credentials = await derive(password, account.salt);
      if (credentials.hash !== account.hash) throw new Error('Incorrect email or password.');

      onLogin({
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role === 'admin' ? 'admin' : 'user'
      });
    } catch (err) {
      setError(err.message || 'Unable to continue. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const switchMode = () => {
    setMode(current => current === 'login' ? 'register' : 'login');
    setError('');
    setPassword('');
    setConfirm('');
  };

  return <div className="auth-shell">
    <aside className="auth-aside">
      <div className="auth-brand"><div className="brand-mark"><Activity size={21}/></div><div><strong>dashboard</strong><small>BUSINESS WORKSPACE</small></div></div>
      <div className="auth-pitch">
        <span className="banner-kicker"><Sparkles size={14}/> YOUR BUSINESS, IN FOCUS</span>
        <h1>Make space for<br/>better business.</h1>
        <p>Keep customers, sales and everyday work organised in one clear workspace.</p>
        <div className="auth-feature"><CheckCircle2 size={17}/> One place for your business activity</div>
        <div className="auth-feature"><CheckCircle2 size={17}/> Simple sales and payment tracking</div>
        <div className="auth-feature"><CheckCircle2 size={17}/> Separate browser workspace for each account</div>
      </div>
      <span className="auth-aside-foot">A clearer way to run your day.</span>
    </aside>
    <main className="auth-main">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-mobile-brand"><div className="brand-mark"><Activity size={20}/></div><b>dashboard</b></div>
        <span className="auth-overline">{mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</span>
        <h2>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</h2>
        <p className="auth-subtitle">{mode === 'login' ? 'Enter your details to access your workspace.' : 'Register your details to create a workspace account.'}</p>
        {mode === 'register' && <label>Full name<input autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required minLength={2}/></label>}
        <label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required/></label>
        <label>Password<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'login' ? 'Enter your password' : 'At least 8 characters'} required minLength={8}/></label>
        {mode === 'register' && <>
          <label>Confirm password<input type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter your password" required minLength={8}/></label>
          <div className="auth-demo">
            <b>Administrator registration</b>
            <span>Use <code>admin@dashboard.local</code> as the email address to create the administrator account. All other email addresses create standard workspace accounts.</span>
          </div>
        </>}
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="btn btn-primary auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        <div className="auth-switch">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'}<button type="button" onClick={switchMode}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></div>
      </form>
      <span className="auth-legal">Your account and workspace data are stored in this browser only.</span>
    </main>
  </div>;
}
