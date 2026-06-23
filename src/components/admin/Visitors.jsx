import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Search, Plus, Download, Trash2, Edit3, 
  X, UserPlus, Phone, MapPin, Calendar, 
  Filter, RefreshCw, MoreVertical, ChevronRight
} from 'lucide-react';
import CountUp from 'react-countup';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Reusing the refined CSS module
import s from '../../styles/Visitors.module.css'; 

ChartJS.register(ArcElement, Tooltip, Legend);

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    origin: '',
    category: 'Guest',
    service: 'Sunday Service',
    visit_date: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('visit_date', { ascending: false });
    if (!error) setVisitors(data);
    setLoading(false);
  };

  // --- Actions ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openDrawer = (visitor = null) => {
    if (visitor) {
      setEditingId(visitor.id);
      setFormData({ ...visitor });
    } else {
      setEditingId(null);
      setFormData({
        full_name: '', phone: '', origin: '',
        category: 'Guest', service: 'Sunday Service',
        visit_date: new Date().toISOString().split('T')[0],
        remarks: ''
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let result;
    if (editingId) {
      result = await supabase.from('visitors').update(formData).eq('id', editingId).select();
    } else {
      result = await supabase.from('visitors').insert([formData]).select();
    }

    if (!result.error) {
      fetchVisitors();
      setIsDrawerOpen(false);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this visitor record?")) {
      await supabase.from('visitors').delete().eq('id', id);
      setVisitors(visitors.filter(v => v.id !== id));
    }
  };

  const exportCSV = () => {
    const headers = "Name,Phone,Origin,Category,Service,Date\n";
    const rows = filteredVisitors.map(v => 
      `${v.full_name},${v.phone},${v.origin},${v.category},${v.service},${v.visit_date}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitors_${activeCategory}.csv`;
    a.click();
  };

  // --- Logic & Charts ---
  const filteredVisitors = useMemo(() => {
    return visitors.filter(v => {
      const matchesSearch = v.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            v.origin?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = activeCategory === 'All' || v.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [visitors, searchTerm, activeCategory]);

  const categoryStats = {
    labels: ['Guest', 'Newcomer', 'Member'],
    datasets: [{
      data: [
        visitors.filter(v => v.category === 'Guest').length,
        visitors.filter(v => v.category === 'Newcomer').length,
        visitors.filter(v => v.category === 'Member').length,
      ],
      backgroundColor: ['#D4AF37', '#1A1A1A', '#E2E8F0'],
      borderWidth: 0
    }]
  };

  return (
    <div className={s.dashboard}>
      {/* Header */}
      <header className={s.header}>
        <div className={s.titleArea}>
          <h1>Visitor Registry</h1>
          <p>Tracking church growth and hospitality</p>
        </div>
        <div className={s.desktopActions}>
          <button className={s.secondaryBtn} onClick={exportCSV}>
            <Download size={18} /> Export CSV
          </button>
          <button className={s.primaryBtn} onClick={() => openDrawer()}>
            <Plus size={18} /> New Visitor
          </button>
        </div>
      </header>

      {/* Analytics */}
      <section className={s.analyticsSection}>
        <div className={s.statCard}>
          <div className={s.chartWrapper}>
            <Doughnut data={categoryStats} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
            <div className={s.centerCount}>
              <CountUp end={visitors.length} />
            </div>
          </div>
          <div>
            <h4 style={{ margin: 0 }}>Total Visitors</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>All-time records</p>
          </div>
        </div>

        <div className={s.statCard}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>This Month</h4>
            <div style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'Instrument Serif' }}>
              <CountUp end={visitors.filter(v => new Date(v.visit_date).getMonth() === new Date().getMonth()).length} />
            </div>
          </div>
          <div className={s.badge}>Retention: 64%</div>
        </div>
      </section>

      {/* Sticky Search & Chips */}
      <div className={s.stickySearch}>
        <div className={s.searchWrapper}>
          <Search size={20} color="#94a3b8" />
          <input 
            placeholder="Search by name or origin..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={s.chipFilter}>
          {['All', 'Guest', 'Newcomer', 'Member'].map(cat => (
            <button 
              key={cat}
              className={activeCategory === cat ? s.activeChip : s.chip}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className={s.desktopTable}>
        <table className={s.modernTable}>
          <thead>
            <tr>
              <th>Visitor</th>
              <th>Origin</th>
              <th>Category</th>
              <th>Service Type</th>
              <th>Visit Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.map(v => (
              <tr key={v.id}>
                <td>
                  <div className={s.userCell}>
                    <div className={s.avatar}>{v.full_name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{v.full_name}</div>
                      <small style={{ color: '#64748b' }}>{v.phone || 'No Phone'}</small>
                    </div>
                  </div>
                </td>
                <td>{v.origin}</td>
                <td><span className={s.badge}>{v.category}</span></td>
                <td>{v.service}</td>
                <td>{new Date(v.visit_date).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className={s.iconBtn} onClick={() => openDrawer(v)}><Edit3 size={16} /></button>
                    <button className={s.iconBtn} onClick={() => handleDelete(v.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className={s.mobileCards}>
        {filteredVisitors.map(v => (
          <div key={v.id} className={s.mCard} onClick={() => openDrawer(v)}>
            <div className={s.mCardHeader}>
              <div className={s.mAvatar}>{v.full_name[0]}</div>
              <div className={s.mTitle}>
                <h4>{v.full_name}</h4>
                <p>{v.category} • {v.service}</p>
              </div>
              <ChevronRight size={20} color="#cbd5e1" />
            </div>
          </div>
        ))}
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
              <h2>{editingId ? 'Edit Record' : 'New Visitor'}</h2>
              <button className={s.iconBtn} onClick={() => setIsDrawerOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={s.inputGroup}>
                <label><UserPlus size={12} /> Full Name</label>
                <input name="full_name" value={formData.full_name} onChange={handleInputChange} required />
              </div>

              <div className={s.inputGroup}>
                <label><Phone size={12} /> Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>

              <div className={s.inputGroup}>
                <label><MapPin size={12} /> Place of Origin</label>
                <input name="origin" value={formData.origin} onChange={handleInputChange} placeholder="City or Church" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className={s.inputGroup}>
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="Guest">Guest</option>
                    <option value="Newcomer">Newcomer</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <div className={s.inputGroup}>
                  <label>Service</label>
                  <select name="service" value={formData.service} onChange={handleInputChange}>
                    <option value="Sunday Service">Sunday</option>
                    <option value="Mid-week Service">Mid-week</option>
                    <option value="Special Event">Special</option>
                  </select>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label><Calendar size={12} /> Visit Date</label>
                <input type="date" name="visit_date" value={formData.visit_date} onChange={handleInputChange} required />
              </div>

              <div className={s.inputGroup}>
                <label>Remarks / Notes</label>
                <textarea 
                  name="remarks" 
                  value={formData.remarks} 
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', minHeight: '80px' }}
                />
              </div>

              <button type="submit" className={s.submitBtn} disabled={loading}>
                {loading ? 'Processing...' : (editingId ? 'Update Record' : 'Save Visitor')}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Visitors;