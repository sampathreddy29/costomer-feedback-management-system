import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Download,
  Filter,
  ImageUp,
  LayoutDashboard,
  LogOut,
  MessageSquareReply,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  UsersRound
} from 'lucide-react';
import { api, apiBaseUrl, clearSession, getStoredUser, getToken, storeSession, uploadsUrl } from './lib/api';

const categories = ['service', 'product', 'website', 'delivery', 'support', 'other'];
const statuses = ['new', 'in-review', 'resolved', 'closed'];

function App() {
  const [user, setUser] = useState(getStoredUser());
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (event) => {
    event.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const body = authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : authForm;
      const session = await api(endpoint, { method: 'POST', body: JSON.stringify(body) });
      storeSession(session);
      setUser(session.user);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  if (!user) {
    return <AuthScreen mode={authMode} setMode={setAuthMode} form={authForm} setForm={setAuthForm} onSubmit={handleAuth} error={authError} loading={loading} />;
  }

  return <Dashboard user={user} onLogout={logout} />;
}

function AuthScreen({ mode, setMode, form, setForm, onSubmit, error, loading }) {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="brand-row">
          <div className="brand-mark"><MessageSquareReply size={24} /></div>
          <div>
            <p className="eyebrow">Customer Feedback</p>
            <h1>Management System</h1>
          </div>
        </div>
        <div className="auth-copy">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create customer account'}</h2>
          <p>{mode === 'login' ? 'Sign in to manage feedback, ratings, replies, reports, and customer satisfaction trends.' : 'Register to submit feedback, upload screenshots, and track responses from the business.'}</p>
        </div>
        <form className="auth-form" onSubmit={onSubmit}>
          {mode === 'register' && (
            <label>
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" required minLength={6} />
          </label>
          {error && <div className="alert error">{error}</div>}
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? <RefreshCw className="spin" size={18} /> : <ShieldCheck size={18} />}
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <button className="link-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account? Register' : 'Already registered? Login'}
        </button>
      </section>
      <section className="auth-side">
        <div className="metric-strip">
          <Metric icon={<Star />} label="Ratings" value="1-5" />
          <Metric icon={<ClipboardList />} label="Reports" value="CSV" />
          <Metric icon={<BarChart3 />} label="Trends" value="Live" />
        </div>
      </section>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  const [view, setView] = useState(user.role === 'admin' ? 'admin' : 'feedback');
  const tabs = user.role === 'admin'
    ? [{ id: 'admin', label: 'Dashboard', icon: LayoutDashboard }, { id: 'feedback', label: 'Feedback', icon: ClipboardList }, { id: 'users', label: 'Users', icon: UsersRound }]
    : [{ id: 'feedback', label: 'Submit', icon: Send }, { id: 'history', label: 'My Feedback', icon: ClipboardList }];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row compact">
          <div className="brand-mark"><MessageSquareReply size={20} /></div>
          <div>
            <p className="eyebrow">Feedback</p>
            <h1>System</h1>
          </div>
        </div>
        <nav className="nav-list">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return <button key={tab.id} className={view === tab.id ? 'active' : ''} onClick={() => setView(tab.id)}><Icon size={18} />{tab.label}</button>;
          })}
        </nav>
        <div className="profile-box">
          <div className="avatar"><UserRound size={20} /></div>
          <div>
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
        </div>
        <button className="ghost-btn" onClick={onLogout}><LogOut size={18} />Logout</button>
      </aside>
      <main className="content">
        {view === 'admin' && <AdminDashboard />}
        {view === 'feedback' && <FeedbackWorkspace adminMode={user.role === 'admin'} />}
        {view === 'history' && <CustomerHistory />}
        {view === 'users' && <UsersPanel />}
      </main>
    </div>
  );
}

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [summaryData, trendData] = await Promise.all([
        api('/reports/summary'),
        api('/reports/monthly-trends')
      ]);
      setSummary(summaryData);
      setTrends(trendData.trends || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const totals = summary?.totals || { totalFeedback: 0, averageRating: 0, positive: 0, neutral: 0, negative: 0 };
  const maxTrend = Math.max(1, ...trends.map((item) => item.count));

  return (
    <section className="stack">
      <Header title="Admin Dashboard" subtitle="Track customer satisfaction, ratings, categories, and monthly activity." action={<button className="secondary-btn" onClick={load}><RefreshCw size={17} />Refresh</button>} />
      {error && <div className="alert error">{error}</div>}
      <div className="kpi-grid">
        <Metric icon={<ClipboardList />} label="Total feedback" value={totals.totalFeedback || 0} />
        <Metric icon={<Star />} label="Average rating" value={Number(totals.averageRating || 0).toFixed(1)} />
        <Metric icon={<CheckCircle2 />} label="Positive" value={totals.positive || 0} />
        <Metric icon={<MessageSquareReply />} label="Negative" value={totals.negative || 0} />
      </div>
      <div className="split-grid">
        <section className="panel">
          <h2>Monthly Trends</h2>
          <div className="bar-chart">
            {trends.length === 0 && <p className="muted">No trend data yet.</p>}
            {trends.map((item) => (
              <div className="bar-item" key={`${item._id.year}-${item._id.month}`}>
                <span>{item._id.month}/{item._id.year}</span>
                <div><i style={{ width: `${(item.count / maxTrend) * 100}%` }} /></div>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <h2>Breakdown</h2>
          <Breakdown title="By status" data={summary?.byStatus || []} />
          <Breakdown title="By category" data={summary?.byCategory || []} />
        </section>
      </div>
    </section>
  );
}

function FeedbackWorkspace({ adminMode, showForm = !adminMode }) {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', category: '' });
  const [form, setForm] = useState({ rating: 5, category: 'service', comment: '', screenshot: null });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    return params.toString() ? `?${params}` : '';
  }, [filters]);

  const load = async () => {
    try {
      const data = await api(adminMode ? `/feedback${query}` : '/feedback/mine');
      setItems(data.feedback || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, [query, adminMode]);

  const submitFeedback = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const body = new FormData();
      body.append('rating', form.rating);
      body.append('category', form.category);
      body.append('comment', form.comment);
      if (form.screenshot) body.append('screenshot', form.screenshot);
      await api('/feedback', { method: 'POST', body });
      setForm({ rating: 5, category: 'service', comment: '', screenshot: null });
      event.target.reset();
      setMessage('Feedback submitted successfully.');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="stack">
      <Header title={adminMode ? 'All Feedback' : showForm ? 'Submit Feedback' : 'My Feedback'} subtitle={adminMode ? 'Search, filter, reply, resolve, or export customer feedback.' : showForm ? 'Send ratings, comments, and screenshots to the business.' : 'Review your submitted feedback and business replies.'} action={adminMode && <ExportButton />} />
      {!adminMode && showForm && (
        <section className="panel">
          <form className="feedback-form" onSubmit={submitFeedback}>
            <label>Rating
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
            </label>
            <label>Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select>
            </label>
            <label className="wide">Comment
              <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Describe your experience" required minLength={5} />
            </label>
            <label className="file-input"><ImageUp size={18} />Screenshot
              <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, screenshot: e.target.files[0] })} />
            </label>
            <button className="primary-btn" type="submit"><Send size={18} />Submit</button>
          </form>
        </section>
      )}
      {adminMode && <Filters filters={filters} setFilters={setFilters} />}
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      <FeedbackList items={items} reload={load} adminMode={adminMode} />
    </section>
  );
}

function CustomerHistory() {
  return <FeedbackWorkspace adminMode={false} />;
}

function FeedbackList({ items, reload, adminMode }) {
  if (items.length === 0) return <section className="panel empty-state">No feedback records found.</section>;
  return (
    <section className="feedback-list">
      {items.map((item) => <FeedbackCard key={item._id} item={item} reload={reload} adminMode={adminMode} />)}
    </section>
  );
}

function FeedbackCard({ item, reload, adminMode }) {
  const [reply, setReply] = useState(item.reply?.message || '');
  const [status, setStatus] = useState(item.status);
  const [busy, setBusy] = useState(false);

  const update = async () => {
    setBusy(true);
    try {
      await api(`/feedback/${item._id}`, { method: 'PUT', body: JSON.stringify({ status, reply }) });
      reload();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this feedback?')) return;
    await api(`/feedback/${item._id}`, { method: 'DELETE' });
    reload();
  };

  return (
    <article className="feedback-card">
      <div className="card-topline">
        <div>
          <strong>{item.user?.name || 'Customer'}</strong>
          <span>{new Date(item.createdAt).toLocaleDateString()} · {item.category}</span>
        </div>
        <div className={`status ${item.status}`}>{item.status}</div>
      </div>
      <div className="rating-row">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={17} fill={i < item.rating ? 'currentColor' : 'none'} />)}</div>
      <p>{item.comment}</p>
      {item.screenshot && <a className="image-link" href={`${uploadsUrl}${item.screenshot}`} target="_blank" rel="noreferrer">View screenshot</a>}
      {item.reply?.message && <div className="reply-box"><strong>Admin reply</strong><p>{item.reply.message}</p></div>}
      {adminMode && (
        <div className="admin-actions">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply to customer" />
          <button className="secondary-btn" onClick={update} disabled={busy}><MessageSquareReply size={16} />Save</button>
          <button className="danger-btn" onClick={remove}><Trash2 size={16} /></button>
        </div>
      )}
    </article>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await api('/users');
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const updateUser = async (id, changes) => {
    await api(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(changes) });
    load();
  };

  return (
    <section className="stack">
      <Header title="Users" subtitle="Manage roles and active accounts." action={<button className="secondary-btn" onClick={load}><RefreshCw size={17} />Refresh</button>} />
      {error && <div className="alert error">{error}</div>}
      <section className="panel table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><select value={user.role} onChange={(e) => updateUser(user._id, { role: e.target.value })}><option value="customer">customer</option><option value="admin">admin</option></select></td>
                <td><button className={user.isActive ? 'pill active-pill' : 'pill'} onClick={() => updateUser(user._id, { isActive: !user.isActive })}>{user.isActive ? 'Active' : 'Inactive'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}

function Filters({ filters, setFilters }) {
  return (
    <section className="filter-row">
      <label><Search size={16} />Search<input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="keyword" /></label>
      <label><Filter size={16} />Status<select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All</option>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
      <label>Category<select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}><option value="">All</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
    </section>
  );
}

function ExportButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const downloadCsv = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/reports/export.csv`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!response.ok) throw new Error('CSV export failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'feedback-report.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="export-wrap">
      <button className="secondary-btn" type="button" onClick={downloadCsv} disabled={busy}>
        {busy ? <RefreshCw className="spin" size={17} /> : <Download size={17} />}
        Export CSV
      </button>
      {error && <span className="inline-error">{error}</span>}
    </div>
  );
}

function Header({ title, subtitle, action }) {
  return <header className="page-header"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</header>;
}

function Metric({ icon, label, value }) {
  return <div className="metric"><div className="metric-icon">{icon}</div><span>{label}</span><strong>{value}</strong></div>;
}

function Breakdown({ title, data }) {
  return <div className="breakdown"><h3>{title}</h3>{data.length === 0 ? <p className="muted">No data yet.</p> : data.map((row) => <div key={row._id}><span>{row._id}</span><strong>{row.count}</strong></div>)}</div>;
}

export default App;
