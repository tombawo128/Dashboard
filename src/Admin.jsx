import { useState } from 'react';
import { Activity, Users, ShieldCheck, Database, LogOut, Trash2, Search, RefreshCw, Wallet, ClipboardList, TrendingUp, CheckCircle2 } from 'lucide-react';

const getAccounts = () => {
  try {
    const value = JSON.parse(localStorage.getItem('dashboard_accounts') || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const demoCustomers = [
  { name: 'Kivu Creative Studio', email: 'hello@kivucreative.example', status: 'Active' },
  { name: 'Amina Mutesi', email: 'amina.mutesi@example.com', status: 'Active' },
  { name: 'Daniel Okafor', email: 'daniel.okafor@example.com', status: 'Active' },
  { name: 'Greenline Supplies', email: 'sales@greenline.example', status: 'Active' },
  { name: 'Maya Uwimana', email: 'maya.uwimana@example.com', status: 'Archived' }
];

const demoSales = [
  { reference: 'S-1048', customer: 'Kivu Creative Studio', item: 'Brand identity package', amount: 485000, status: 'Paid' },
  { reference: 'S-1047', customer: 'Amina Mutesi', item: 'Monthly service plan', amount: 125000, status: 'Paid' },
  { reference: 'S-1046', customer: 'Greenline Supplies', item: 'Office supplies', amount: 320000, status: 'Pending' },
  { reference: 'S-1045', customer: 'Daniel Okafor', item: 'Consultation', amount: 95000, status: 'Paid' }
];

const demoTasks = [
  { title: 'Review pending supplier invoice', due: 'Today', priority: 'High', done: false },
  { title: 'Prepare weekly performance report', due: 'Tomorrow', priority: 'Medium', done: false },
  { title: 'Follow up with new customers', due: '21 Nov 2026', priority: 'Low', done: true }
];

const formatMoney = value => new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(value);
const cardStyle = { background: '#fff', padding: 22, borderRadius: 14, border: '1px solid #e9eaf1', boxShadow: '0 3px 16px #20223208' };
const thStyle = { padding: 12, borderBottom: '1px solid #eee', color: '#777', fontSize: 12, textAlign: 'left', whiteSpace: 'nowrap' };
const tdStyle = { padding: 12, borderBottom: '1px solid #eee', fontSize: 13, color: '#414252', whiteSpace: 'nowrap' };

export default function AdminPanel({ session, onLogout }) {
  const [accounts, setAccounts] = useState(getAccounts);
  const [query, setQuery] = useState('');
  const refresh = () => setAccounts(getAccounts());

  const remove = account => {
    if (account.id === session.id) return;
    if (!confirm('Delete this account and its browser workspace data?')) return;
    const next = getAccounts().filter(item => item.id !== account.id);
    localStorage.setItem('dashboard_accounts', JSON.stringify(next));
    ['customers', 'sales', 'tasks', 'business', 'currency', 'starter_data_initialized'].forEach(key => {
      localStorage.removeItem('dashboard_' + account.id + '_' + key);
    });
    refresh();
  };

  const visible = accounts.filter(account =>
    (account.name + ' ' + account.email).toLowerCase().includes(query.toLowerCase())
  );
  const collected = demoSales.filter(sale => sale.status === 'Paid').reduce((sum, sale) => sum + sale.amount, 0);
  const pending = demoSales.filter(sale => sale.status === 'Pending').reduce((sum, sale) => sum + sale.amount, 0);

  return <div style={{ minHeight: '100vh', background: '#f5f6fa', color: '#202232', fontFamily: 'inherit' }}>
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 5%', background: '#23212c', color: 'white' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Activity size={22}/>
        <div><b>Dashboard Admin</b><small style={{ display: 'block', opacity: .65, marginTop: 3 }}>ADMINISTRATOR CONSOLE</small></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 13, color: '#e1dfff' }}>{session.name}</span>
        <button onClick={onLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent', color: 'white', border: '1px solid #ffffff50', padding: '9px 12px', borderRadius: 9, cursor: 'pointer' }}><LogOut size={16}/> Sign out</button>
      </div>
    </header>

    <main style={{ maxWidth: 1240, margin: 'auto', padding: '30px 5%' }}>
      <div style={{ marginBottom: 24 }}>
        <span style={{ color: '#7165c9', fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }}>ADMINISTRATOR OVERVIEW</span>
        <h1 style={{ margin: '8px 0 5px', fontSize: 28 }}>Welcome, {session.name}</h1>
        <p style={{ color: '#707184', margin: 0 }}>Review sample business activity and manage accounts registered in this browser.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(205px,1fr))', gap: 15, margin: '22px 0' }}>
        {[
          [Users, 'Registered accounts', accounts.length, '#7165c9'],
          [Wallet, 'Sample collected revenue', formatMoney(collected), '#25966f'],
          [TrendingUp, 'Sample pending payments', formatMoney(pending), '#c18a36'],
          [ClipboardList, 'Sample tasks completed', demoTasks.filter(task => task.done).length + ' / ' + demoTasks.length, '#5486c5']
        ].map(([Icon, label, value, color]) => <div key={label} style={cardStyle}>
          <Icon color={color} size={21}/>
          <small style={{ display: 'block', marginTop: 13, color: '#777' }}>{label}</small>
          <strong style={{ display: 'block', fontSize: 22, marginTop: 6, color: '#242536' }}>{value}</strong>
        </div>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.25fr) minmax(280px,.75fr)', gap: 16, alignItems: 'start' }}>
        <section style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <div><h2 style={{ margin: 0, fontSize: 18 }}>Sample sales activity</h2><p style={{ margin: '5px 0 0', color: '#777', fontSize: 12 }}>Illustrative records for the administrator overview</p></div>
            <span style={{ fontSize: 11, color: '#777' }}>{demoSales.length} transactions</span>
          </div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Reference', 'Customer', 'Item', 'Amount', 'Status'].map(label => <th key={label} style={thStyle}>{label}</th>)}</tr></thead>
            <tbody>{demoSales.map(sale => <tr key={sale.reference}>
              <td style={tdStyle}>{sale.reference}</td><td style={tdStyle}>{sale.customer}</td><td style={tdStyle}>{sale.item}</td><td style={tdStyle}>{formatMoney(sale.amount)}</td>
              <td style={tdStyle}><span style={{ color: sale.status === 'Paid' ? '#21845f' : '#b27b2e', fontWeight: 700 }}>{sale.status}</span></td>
            </tr>)}</tbody>
          </table></div>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: '0 0 14px', fontSize: 18 }}>Priority tasks</h2>
          {demoTasks.map(task => <div key={task.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid #f0f0f4' }}>
            <CheckCircle2 size={17} color={task.done ? '#23966d' : '#9a91d8'}/>
            <div style={{ flex: 1 }}><b style={{ display: 'block', fontSize: 13, textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</b><small style={{ color: '#888' }}>Due {task.due} · {task.priority} priority</small></div>
          </div>)}
          <p style={{ margin: '12px 0 0', fontSize: 11, color: '#888' }}>These are sample records, not live business transactions.</p>
        </section>
      </div>

      <section style={{ ...cardStyle, marginTop: 17 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div><h2 style={{ margin: 0, fontSize: 18 }}>Registered accounts</h2><p style={{ margin: '5px 0 0', color: '#777', fontSize: 12 }}>{visible.length} accounts found in this browser</p></div>
          <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: 10, borderRadius: 8, border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}><RefreshCw size={15}/> Refresh list</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #ddd', borderRadius: 9, padding: 10, margin: '18px 0' }}>
          <Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or email" style={{ border: 0, outline: 0, width: '100%', background: 'transparent' }}/>
        </div>
        <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead><tr>{['User', 'Email', 'Role', 'Created', 'Action'].map(label => <th key={label} style={thStyle}>{label}</th>)}</tr></thead>
          <tbody>{visible.map(account => <tr key={account.id}>
            <td style={tdStyle}>{account.name || 'Unnamed'}</td><td style={tdStyle}>{account.email}</td><td style={tdStyle}>{account.role === 'admin' ? 'Administrator' : 'Workspace user'}</td><td style={tdStyle}>{account.createdAt ? new Date(account.createdAt).toLocaleDateString() : '—'}</td>
            <td style={tdStyle}><button disabled={account.id === session.id} onClick={() => remove(account)} title={account.id === session.id ? 'You cannot delete your active account' : 'Delete account'} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#b42318', border: 0, background: 'transparent', cursor: account.id === session.id ? 'not-allowed' : 'pointer', opacity: account.id === session.id ? .35 : 1 }}><Trash2 size={15}/> Delete</button></td>
          </tr>)}</tbody>
        </table>{visible.length === 0 && <p style={{ padding: 20, color: '#777' }}>No matching accounts.</p>}</div>
      </section>

      <p style={{ fontSize: 12, lineHeight: 1.6, color: '#777', marginTop: 18 }}>Demo business figures are illustrative. Account registration and data are stored only in this browser; this frontend-only administrator role is suitable for demonstration, not production security.</p>
    </main>
  </div>;
}
