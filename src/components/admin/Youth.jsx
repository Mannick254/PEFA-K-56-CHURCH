import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Search, Plus, Download, Trash2, Edit3, 
  X, Users, Phone, Star, Calendar, 
  ChevronRight, User, Heart, Eye
} from 'lucide-react';
import CountUp from 'react-countup';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import s from '../../styles/Youth.module.css'; 

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const Youth = () => {
  const [youth, setYouth] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewUri, setPreviewUri] = useState(null);

  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', phone: '',
    parent_contact: '', talent: '',
    join_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => { fetchYouth(); }, []);

  const fetchYouth = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('youth')
      .select('*')
      .order('join_date', { ascending: false });
    if (!error) setYouth(data);
    setLoading(false);
  };

  // --- Ratio & Analytics Logic ---
  const stats = useMemo(() => {
    const total = youth.length;
    const males = youth.filter(y => y.gender === 'Male').length;
    const females = total - males;
    
    let malePercent = 0;
    let femalePercent = 0;

    if (total > 0) {
      malePercent = parseFloat(((males / total) * 100).toFixed(1));
      femalePercent = parseFloat((100 - malePercent).toFixed(1));
    }
    
    const uniqueTalents = new Set(youth.map(y => y.talent).filter(Boolean)).size;

    return { total, males, females, malePercent, femalePercent, uniqueTalents };
  }, [youth]);

  const genderData = {
    labels: [`Male (${stats.malePercent}%)`, `Female (${stats.femalePercent}%)`],
    datasets: [{
      data: [stats.males, stats.females],
      backgroundColor: ['#1A1A1A', '#D4AF37'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const filteredYouth = youth.filter(y => 
    y.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    y.talent?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Actions ---
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const openDrawer = (member = null) => {
    if (member) {
      setEditingId(member.id);
      setFormData({ ...member });
    } else {
      setEditingId(null);
      setFormData({
        name: '', age: '', gender: 'Male', phone: '',
        parent_contact: '', talent: '',
        join_date: new Date().toISOString().split('T')[0]
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData, age: formData.age ? parseInt(formData.age) : null };
    let res;
    if (editingId) {
      res = await supabase.from('youth').update(payload).eq('id', editingId);
    } else {
      res = await supabase.from('youth').insert([payload]);
    }
    if (!res.error) {
      fetchYouth();
      setIsDrawerOpen(false);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this youth member?")) {
      await supabase.from('youth').delete().eq('id', id);
      setYouth(youth.filter(y => y.id !== id));
    }
  };

  const generatePDF = (outputType = 'download') => {
    const doc = new jsPDF();
    doc.text("Youth Ministry Registry", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Name', 'Age', 'Gender', 'Phone', 'Talent', 'Joined']],
      body: filteredYouth.map(y => [y.name, y.age, y.gender, y.phone, y.talent, y.join_date]),
    });
    outputType === 'preview' ? setPreviewUri(doc.output('datauristring')) : doc.save('youth_members.pdf');
  };

  const getInitials = (n) => n?.split(' ').map(i => i[0]).join('').toUpperCase().slice(0, 2) || 'Y';

  return (
    <div className={s.dashboard}>
      <header className={s.header}>
        <div className={s.titleArea}>
          <h1>Youth Ministry</h1>
          <p>Managing {youth.length} dynamic members</p>
        </div>
        <div className={s.desktopActions}>
          <button className={s.secondaryBtn} onClick={() => generatePDF('preview')}><Eye size={18} /> Preview</button>
          <button className={s.secondaryBtn} onClick={() => generatePDF('download')}><Download size={18} /> Export</button>
          <button className={s.primaryBtn} onClick={() => openDrawer()}><Plus size={18} /> Add Member</button>
        </div>
      </header>

      {/* Analytics Section */}
      <section className={s.analyticsSection}>
        <div className={s.statCard}>
          <div className={s.chartWrapper}>
            <Doughnut data={genderData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
            <div className={s.centerCount}>
              <CountUp end={stats.total} />
            </div>
          </div>
          <div className={s.ratioInfo}>
            <h4>Gender Ratio</h4>
            <div className={s.ratioRow}>
              <span className={s.dotMale}></span> M: {stats.malePercent}%
            </div>
            <div className={s.ratioRow}>
              <span className={s.dotFemale}></span> F: {stats.femalePercent}%
            </div>
          </div>
        </div>

        <div className={s.statCard}>
          <div style={{ flex: 1 }}>
            <h4 className={s.statLabel}>Talent Pool</h4>
            <div className={s.statValue}>{stats.uniqueTalents} Unique Skills</div>
          </div>
          <div className={s.badge} style={{ background: '#fef3c7', color: '#92400e' }}>Highly Diverse</div>
        </div>
      </section>

      {/* Search */}
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
              <th>Member</th>
              <th>Gender/Age</th>
              <th>Talent</th>
              <th>Contacts</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredYouth.map(y => (
              <tr key={y.id}>
                <td>
                  <div className={s.userCell}>
                    <div className={s.avatar}>{getInitials(y.name)}</div>
                    <div style={{ fontWeight: 700 }}>{y.name}</div>
                  </div>
                </td>
                <td>
                  <span className={y.gender === 'Male' ? s.badgeMale : s.badgeFemale}>{y.gender}</span>
                  <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>{y.age} yrs</span>
                </td>
                <td>
                  <div className={s.talentCell}><Star size={14} color="#D4AF37" /> {y.talent || 'General'}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>P: {y.phone || 'N/A'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>G: {y.parent_contact}</div>
                </td>
                <td>{new Date(y.join_date).toLocaleDateString()}</td>
                <td>
                  <div className={s.actions}>
                    <button className={s.iconBtn} onClick={() => openDrawer(y)}><Edit3 size={16} /></button>
                    <button className={s.iconBtn} onClick={() => handleDelete(y.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className={s.mobileCards}>
        {filteredYouth.map(y => (
          <div key={y.id} className={s.mCard} onClick={() => openDrawer(y)}>
            <div className={s.mCardHeader}>
              <div className={s.mAvatar}>{getInitials(y.name)}</div>
              <div className={s.mTitle}>
                <h4>{y.name}</h4>
                <p>{y.talent || 'Member'} • {y.gender}</p>
              </div>
              <ChevronRight size={20} color="#cbd5e1" />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile FABs */}
      <div className={s.fabContainer}>
        <button className={s.fab} style={{background: '#D4AF37'}} onClick={() => generatePDF('download')}><Download size={24} /></button>
        <button className={s.fab} style={{background: '#334155'}} onClick={() => generatePDF('preview')}><Eye size={24} /></button>
        <button className={s.fab} onClick={() => openDrawer()}><Plus size={24} /></button>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <>
          <div className={s.overlay} onClick={() => setIsDrawerOpen(false)} />
          <div className={s.drawer}>
            <div className={s.drawerHeader}>
              <h2>{editingId ? 'Edit Profile' : 'New Member'}</h2>
              <button className={s.iconBtn} onClick={() => setIsDrawerOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className={s.form}>
              <div className={s.inputGroup}>
                <label><User size={12} /> Full Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className={s.formRow}>
                <div className={s.inputGroup}>
                  <label>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
                </div>
                <div className={s.inputGroup}>
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className={s.inputGroup}>
                <label><Phone size={12} /> Personal Phone</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className={s.inputGroup}>
                <label><Heart size={12} /> Parent/Guardian Contact</label>
                <input name="parent_contact" value={formData.parent_contact} onChange={handleInputChange} />
              </div>
              <div className={s.inputGroup}>
                <label><Star size={12} /> Talent / Skill</label>
                <input name="talent" value={formData.talent} onChange={handleInputChange} />
              </div>
              <div className={s.inputGroup}>
                <label><Calendar size={12} /> Joined Date</label>
                <input type="date" name="join_date" value={formData.join_date} onChange={handleInputChange} required />
              </div>
              <button type="submit" className={s.submitBtn} disabled={loading}>
                {loading ? 'Processing...' : 'Save Member'}
              </button>
            </form>
          </div>
        </>
      )}

      {/* PDF Modal */}
      {previewUri && (
        <div className={s.previewOverlay} onClick={() => setPreviewUri(null)}>
          <div className={s.previewModal} onClick={e => e.stopPropagation()}>
            <div className={s.previewHeader}>
              <h3>Document Preview</h3>
              <button onClick={() => setPreviewUri(null)}><X /></button>
            </div>
            <iframe src={previewUri} title="PDF Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Youth;
