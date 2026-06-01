import React, { useState, useEffect } from 'react';

// Deep Neo-Tech Mechanical UI styling
const matrixStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&display=swap');
  
  body { 
    margin: 0; 
    background: #070a13; 
    color: #e2e8f0; 
    font-family: 'JetBrains Mono', monospace; 
    letter-spacing: -0.2px;
  }
  
  .terminal-frame { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }
  
  .sys-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    border-bottom: 1px solid rgba(56, 189, 248, 0.15); 
    padding-bottom: 24px; 
    margin-bottom: 40px; 
  }
  
  .core-title { font-size: 20px; font-weight: 800; color: #f8fafc; }
  .pulse-node { display: inline-block; width: 8px; height: 8px; background: #38bdf8; border-radius: 50%; box-shadow: 0 0 12px #38bdf8; margin-right: 12px; animation: glow 2s infinite; }
  
  .split-grid { display: grid; grid-template-columns: 320px 1fr; gap: 40px; }
  @media (max-width: 768px) { .split-grid { grid-template-columns: 1fr; gap: 24px; } }
  
  .status-panel { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 28px; backdrop-filter: blur(8px); height: fit-content; }
  .metric-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .metric-row:last-child { border: none; }
  .metric-lbl { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
  .metric-count { font-size: 22px; font-weight: 800; color: #38bdf8; }
  
  .stream-container { display: flex; flex-direction: column; gap: 16px; }
  .control-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  
  .filter-tabs { display: flex; gap: 6px; background: rgba(0,0,0,0.25); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
  .tab-trigger { background: transparent; border: none; color: #475569; padding: 6px 14px; font-size: 11px; font-weight: 700; cursor: pointer; border-radius: 6px; text-transform: uppercase; transition: all 0.2s; }
  .tab-trigger.active { background: #1e293b; color: #38bdf8; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
  
  .thread-card { 
    background: linear-gradient(135deg, rgba(30,41,59,0.4) 0%, rgba(15,23,42,0.6) 100%);
    border-left: 4px solid #64748b; 
    border-top: 1px solid rgba(255,255,255,0.03);
    border-right: 1px solid rgba(255,255,255,0.03);
    border-bottom: 1px solid rgba(255,255,255,0.03);
    border-radius: 12px; 
    padding: 20px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    transition: transform 0.2s, border-color 0.2s;
  }
  .thread-card:hover { transform: translateY(-2px); }
  .thread-card.prio-High { border-left-color: #ef4444; box-shadow: inset 4px 0 20px rgba(239,68,68,0.02); }
  .thread-card.prio-Medium { border-left-color: #f59e0b; }
  .thread-card.prio-Low { border-left-color: #10b981; }
  
  .cb-wrapper { display: flex; align-items: flex-start; gap: 18px; }
  .custom-cb { width: 18px; height: 18px; border-radius: 4px; border: 2px solid #334155; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-top: 3px; transition: all 0.2s; background: transparent; }
  .custom-cb.checked { background: #38bdf8; border-color: #38bdf8; box-shadow: 0 0 8px rgba(56,189,248,0.4); }
  
  .action-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); color: #94a3b8; padding: 6px 12px; font-size: 11px; font-weight: 700; cursor: pointer; border-radius: 6px; font-family: inherit; }
  .action-btn:hover { background: rgba(255,255,255,0.08); color: #f8fafc; }
  .btn-kill { color: #f87171; border-color: rgba(239,68,68,0.2); }
  .btn-kill:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
  .btn-init { background: #38bdf8; color: #070a13; font-weight: 800; border: none; padding: 10px 18px; }
  .btn-init:hover { background: #7dd3fc; box-shadow: 0 0 16px rgba(56,189,248,0.3); }

  .pane-overlay { position: fixed; inset: 0; background: rgba(3, 7, 18, 0.8); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 999; }
  .pane-box { background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.2); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); padding: 32px; border-radius: 16px; width: 100%; max-width: 440px; }
  .field-input { width: 100%; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid #1e293b; border-radius: 8px; color: #fff; font-family: inherit; font-size: 13px; box-sizing: border-box; margin-top: 6px; }
  .field-input:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 8px rgba(56,189,248,0.15); }

  @keyframes glow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; transform: scale(1.1); } }
`;

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'PENDING' | 'COMPLETED';
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const raw = localStorage.getItem('core_thread_matrix');
    return raw ? JSON.parse(raw) : [
      { id: '1', title: 'Compile Fiber Optics Core System Architecture', description: 'Map dynamic routing layer modules across physical distribution vectors.', dueDate: '2026-06-05', priority: 'High', status: 'PENDING' },
      { id: '2', title: 'Audit Bot Execution Matrix Variables', description: 'Review risk constraints and verification logs.', dueDate: '2026-06-08', priority: 'Medium', status: 'PENDING' }
    ];
  });

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [paneOpen, setPaneOpen] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  useEffect(() => {
    localStorage.setItem('core_thread_matrix', JSON.stringify(tasks));
  }, [tasks]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    overdue: tasks.filter(t => t.status === 'PENDING' && t.dueDate !== '' && new Date(t.dueDate) < new Date(new Date().setHours(0,0,0,0))).length
  };

  const handleOpenPane = (target: Task | null = null) => {
    if (target) {
      setFocusId(target.id);
      setTitle(target.title);
      setDescription(target.description);
      setDueDate(target.dueDate);
      setPriority(target.priority);
    } else {
      setFocusId(null);
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
    }
    setPaneOpen(true);
  };

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (focusId) {
      setTasks(tasks.map(t => t.id === focusId ? { ...t, title, description, dueDate, priority } : t));
    } else {
      const entry: Task = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        description,
        dueDate,
        priority,
        status: 'PENDING'
      };
      setTasks([...tasks, entry]);
    }
    setPaneOpen(false);
  };

  const invertStatus = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'PENDING' ? 'COMPLETED' : 'PENDING' } : t));
  };

  const targetPurge = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="terminal-frame">
      <style>{matrixStyles}</style>

      <header className="sys-header">
        <div className="core-title">
          <span className="pulse-node"></span>
          CORE_STREAM_TRACKER v2.0
        </div>
        <button className="action-btn btn-init" onClick={() => handleOpenPane()}>+ DISPATCH NEW THREAD</button>
      </header>

      <div className="split-grid">
        <aside className="status-panel">
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', marginBottom: '20px', letterSpacing: '1px' }}>// SYSTEM_DIAGNOSTICS</div>
          <div className="metric-row"><span className="metric-lbl">Total Submissions</span><span className="metric-count">{stats.total}</span></div>
          <div className="metric-row"><span className="metric-lbl" style={{ color: '#10b981' }}>Resolved Nodes</span><span className="metric-count" style={{ color: '#10b981' }}>{stats.completed}</span></div>
          <div className="metric-row"><span className="metric-lbl" style={{ color: '#f59e0b' }}>Active Pipeline</span><span className="metric-count" style={{ color: '#f59e0b' }}>{stats.pending}</span></div>
          <div className="metric-row"><span className="metric-lbl" style={{ color: '#ef4444' }}>Breached Deadlines</span><span className="metric-count" style={{ color: '#ef4444' }}>{stats.overdue}</span></div>
        </aside>

        <main className="stream-container">
          <div className="control-row">
            <div className="filter-tabs">
              {(['ALL', 'PENDING', 'COMPLETED'] as const).map(type => (
                <button key={type} className={`tab-trigger ${filter === type ? 'active' : ''}`} onClick={() => setFilter(type)}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {tasks.filter(t => filter === 'ALL' || t.status === filter).length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.05)', color: '#475569', fontSize: '13px' }}>
                // No operations found in current stack allocation.
              </div>
            ) : (
              tasks.filter(t => filter === 'ALL' || t.status === filter).map(task => (
                <div key={task.id} className={`thread-card prio-${task.priority}`} style={{ opacity: task.status === 'COMPLETED' ? 0.35 : 1 }}>
                  <div className="cb-wrapper">
                    <div className={`custom-cb ${task.status === 'COMPLETED' ? 'checked' : ''}`} onClick={() => invertStatus(task.id)}>
                      {task.status === 'COMPLETED' && <span style={{ color: '#070a13', fontSize: '10px', fontWeight: 900 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#f1f5f9', textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none' }}>
                        {task.title}
                      </div>
                      {task.description && <p style={{ margin: '6px 0 10px 0', color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>{task.description}</p>}
                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#475569' }}>
                        <span style={{ color: task.priority === 'High' ? '#f87171' : task.priority === 'Medium' ? '#fbbf24' : '#34d399', fontWeight: 700 }}>
                          [{task.priority.toUpperCase()}_STAGE]
                        </span>
                        {task.dueDate && <span>// TARGET_EXEC_DATE: {task.dueDate}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="action-btn" onClick={() => handleOpenPane(task)}>EDIT</button>
                    <button className="action-btn btn-kill" onClick={() => targetPurge(task.id)}>KILL</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {paneOpen && (
        <div className="pane-overlay">
          <div className="pane-box">
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', marginBottom: '20px' }}>
              {focusId ? '>> RECONFIGURE_THREAD_VARIABLES' : '>> ALLOCATE_NEW_THREAD_BLOCK'}
            </div>
            <form onSubmit={handleCommit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>THREAD IDENTIFIER *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter allocation script description..." className="field-input" />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>METADATA CONTEXT</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional logs..." className="field-input" />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>EXEC_LIMIT_DATE</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="field-input" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>CRITICALITY_LEVEL</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="field-input">
                    <option value="Low">Low Stage</option>
                    <option value="Medium">Medium Stage</option>
                    <option value="High">High Stage</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                <button type="button" className="action-btn" onClick={() => setPaneOpen(false)}>ABORT</button>
                <button type="submit" className="action-btn btn-init" style={{ padding: '8px 16px' }}>COMMIT</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
