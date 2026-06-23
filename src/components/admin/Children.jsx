import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Search, Plus, Download, Trash2, Edit3, 
  X, Baby, User, Phone, Calendar, Star, Info 
} from 'lucide-react';
import CountUp from 'react-countup';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, LineElement, CategoryScale, LinearScale, 
  PointElement, Tooltip, Legend, ArcElement 
} from 'chart.js';

// Assuming the refined CSS module from earlier
import s from '../../styles/Children.module.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend);

const Children = () => {
  // --- States ---
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State (Age removed)
  const [formData, setFormData] = useState({
    name: '',
    parent_name: '',
    parent_contact: '',
    gender: 'Male',
    talent: '',
    join_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .order('join_date', { ascending: true });
    if (!error) setChildren(data);
    setLoading(false);
  };

  // --- Actions ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openDrawer = (child = null) => {
    if (child) {
      setEditingId(child.id);
      setFormData({
        name: child.name,
        parent_name: child.parent_name || '',
        parent_contact: child.parent_contact || '',
        gender: child.gender || 'Male',
        talent: child.talent || '',
        join_date: child.join_date
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', parent_name: '', parent_contact: '',
        gender: 'Male', talent: '', join_date: new Date().toISOString().split('T')[0]
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (editingId) {
      result = await supabase.from('children').update(formData).eq('id', editingId).select();
    } else {
      result = await supabase.from('children').insert([formData]).select();
    }

    if (!result.error) {
      fetchChildren();
      setIsDrawerOpen(false);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await supabase.from('children').delete().eq('id', id);
      setChildren(children.filter(c => c.id !== id));
    }
  };

  const exportCSV = () => {
    const headers = "Name,Parent,Contact,Gender,Talent,Join Date\n";
    const rows = children.map(c => 
      `${c.name},${c.parent_name},${c.parent_contact},${c.gender},${c.talent},${c.join_date}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "children_registry.csv";
    a.click();
  };

  // --- Logic & Charts ---
  const filteredChildren = useMemo(() => {
    return children.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.talent?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [children, searchTerm]);

  const growthData = {
    labels: children.map(c => c.join_date),
    datasets: [{
      label: 'Total Enrollment',
      data: children.map((_, i) => i + 1),
      borderColor: '#D4AF37',
      backgroundColor: 'rgba(212, 175, 55, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [
        children.filter(c => c.gender === 'Male').length,
        children.filter(c => c.gender === 'Female').length
      ],
      backgroundColor: ['#1A1A1A', '#D4AF37'],
      borderWidth: 0
    }]
  };

  return (
    <div className={s.dashboard}>
      {/* Header */}
      <header className={s.header}>
        <div className={s.titleArea}>
          <h1>Children Ministry</h1>
          <p>Nurturing the next generation</p>
        </div>
        <div className={s.desktopActions}>
          <button className={s.secondaryBtn} onClick={exportCSV}>
            <Download size={18} /> Export CSV
          </button>
          <button className={s.primaryBtn} onClick={() => openDrawer()}>
            <Plus size={18} /> Register Child
          </button>
        </div>
      </header>

      {/* Analytics */}
      <section className={s.analyticsSection}>
        <div className={s.statCard}>
          <div className={s.chartWrapper}>
            <Doughnut data={genderData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
            <div className={s.centerCount}>
              <CountUp end={children.length} />
            </div>
          </div>
          <div>
            <h4 style={{ margin: 0 }}>Total Registered</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Active Children</p>
          </div>
        </div>

        <div className={s.statCard} style={{ flexGrow: 2 }}>
          <div style={{ width: '100%', height: '100px' }}>
            <Line data={growthData} options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { x: { display: false }, y: { display: false } }
            }} />
          </div>
          <div style={{ marginLeft: '20px' }}>
            <h4 style={{ margin: 0 }}>Growth Trend</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Enrollment over time</p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className={s.stickySearch}>
        <div className={s.searchWrapper}>
          <Search size={20} color="#94a3b8" />
          <input 
            placeholder="Search by name or talent..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className={s.desktopTable}>
        <table className={s.modernTable}>
          <thead>
            <tr>
              <th>Child Name</th>
              <th>Guardian / Contact</th>
              <th>Gender</th>
              <th>Talent / Interest</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredChildren.map(child => (
              <tr key={child.id}>
                <td>
                  <div className={s.userCell}>
                    <div className={s.avatar}><Baby size={16} /></div>
                    <div style={{ fontWeight: 700 }}>{child.name}</div>
                  </div>
                </td>
                <td>
                  <div>{child.parent_name}</div>
                  <small style={{ color: '#64748b' }}>{child.parent_contact}</small>
                </td>
                <td><span className={s.badge}>{child.gender}</span></td>
                <td>{child.talent || <em style={{ color: '#cbd5e1' }}>Not specified</em>}</td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className={s.iconBtn} onClick={() => openDrawer(child)}><Edit3 size={18} /></button>
                    <button className={s.iconBtn} onClick={() => handleDelete(child.id)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile FAB */}
      <button className={s.fab} onClick={() => openDrawer()}>
        <Plus size={24} />
      </button>

      {/* Drawer Form */}
      {isDrawerOpen && (
        <>
          <div className={s.overlay} onClick={() => setIsDrawerOpen(false)} />
          <div className={s.drawer}>
            <div className={s.drawerHeader}>
              <h2>{editingId ? 'Edit Child' : 'New Registration'}</h2>
              <button className={s.iconBtn} onClick={() => setIsDrawerOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={s.inputGroup}>
                <label><User size={12} /> Child's Full Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter name" />
              </div>

              <div className={s.inputGroup}>
                <label>Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={s.inputGroup}>
                <label><Info size={12} /> Guardian Name</label>
                <input name="parent_name" value={formData.parent_name} onChange={handleInputChange} placeholder="Parent/Guardian" />
              </div>

              <div className={s.inputGroup}>
                <label><Phone size={12} /> Emergency Contact</label>
                <input name="parent_contact" value={formData.parent_contact} onChange={handleInputChange} placeholder="Phone number" />
              </div>

              <div className={s.inputGroup}>
                <label><Star size={12} /> Talents / Interests</label>
                <input name="talent" value={formData.talent} onChange={handleInputChange} placeholder="Singing, Drawing, etc." />
              </div>

              <div className={s.inputGroup}>
                <label><Calendar size={12} /> Join Date</label>
                <input type="date" name="join_date" value={formData.join_date} onChange={handleInputChange} required />
              </div>

              <button type="submit" className={s.submitBtn} disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update Record' : 'Register Child')}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Children;