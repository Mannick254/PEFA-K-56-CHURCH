import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/ChurchMembers.module.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { 
  UserPlus, Search, Download, Edit2, Trash2, 
  Sparkles, Phone, Mail, Filter, X, MoreVertical, Briefcase, Plus, Eye, User, Heart, Calendar, Star
} from 'lucide-react';
import CountUp from 'react-countup';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChurchMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTalent, setFilterTalent] = useState('All');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', occupation: '', talent: '', gender: 'Men', join_date: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);
  const [previewUri, setPreviewUri] = useState(null);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await supabase.from('members').select('*').order('join_date', { ascending: false });
    if (data) setMembers(data);
    setLoading(false);
  };
  
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const action = editingId 
      ? supabase.from('members').update(formData).eq('id', editingId)
      : supabase.from('members').insert([formData]);
    
    const { error } = await action;
    if (!error) { 
        fetchMembers();
        setIsDrawerOpen(false);
    }
    setLoading(false);
  };

  const openDrawer = (member = null) => {
    if (member) {
      setEditingId(member.id);
      setFormData(member);
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', occupation: '', talent: '', gender: 'Men', join_date: new Date().toISOString().split('T')[0] });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', occupation: '', talent: '', gender: 'Men', join_date: new Date().toISOString().split('T')[0] });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setLoading(true);
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (!error) {
        fetchMembers(); 
      }
      setLoading(false);
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone?.includes(searchTerm);
      const matchesTalent = filterTalent === 'All' || m.talent === filterTalent;
      return matchesSearch && matchesTalent;
    });
  }, [members, searchTerm, filterTalent]);

  const generatePDF = (outputType = 'download') => {
    const doc = new jsPDF();
    doc.text("Church Members Directory", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Name', 'Phone', 'Gender', 'Talent', 'Join Date']],
      body: filteredMembers.map(member => [
        member.name,
        member.phone,
        member.gender,
        member.talent,
        new Date(member.join_date).toLocaleDateString()
      ]),
    });

    if (outputType === 'preview') {
      setPreviewUri(doc.output('datauristring'));
    } else {
      doc.save('church_members.pdf');
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Member Directory</h1>
          <p>{members.length} Members Registered</p>
        </div>
        <div className={styles.desktopActions}>
          <button onClick={() => generatePDF('preview')} className={styles.secondaryBtn}><Eye size={18}/> Preview PDF</button>
          <button onClick={() => generatePDF('download')} className={styles.secondaryBtn}><Download size={18}/> Download PDF</button>
          <button onClick={() => openDrawer()} className={styles.primaryBtn}><UserPlus size={18}/> Add Member</button>
        </div>
      </header>

      <section className={styles.analyticsSection}>
        <div className={styles.statCard}>
          <div className={styles.chartWrapper}>
            <Doughnut 
              data={{
                labels: ['Men', 'Women'],
                datasets: [{
                  data: [
                    members.filter(m => m.gender === 'Men').length,
                    members.filter(m => m.gender === 'Women').length
                  ],
                  backgroundColor: ['#1A1A1A', '#D4AF37'],
                  borderWidth: 0,
                  hoverOffset: 4
                }]
              }}
              options={{ cutout: '75%', plugins: { legend: { display: false } } }}
            />
            <div className={styles.centerCount}><CountUp end={members.length} duration={2} /></div>
          </div>
          <div className={styles.statInfo}>
            <h3>Total Register</h3>
            <p>Active community</p>
          </div>
        </div>
      </section>

      <div className={styles.stickySearch}>
        <div className={styles.searchWrapper}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search name or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.chipFilter}>
          {['All', 'Choir', 'Tech', 'Youth', 'Elder'].map(t => (
            <button 
              key={t} 
              className={filterTalent === t ? styles.activeChip : styles.chip}
              onClick={() => setFilterTalent(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.listContainer}>
        <div className={styles.desktopTable}>
          <table className={styles.modernTable}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Contact</th>
                <th>Gender</th>
                <th>Skill</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>{member.name.charAt(0)}</div>
                      <span>{member.name}</span>
                    </div>
                  </td>
                  <td>{member.phone}</td>
                  <td>{member.gender}</td>
                  <td><span className={styles.badge}>{member.talent}</span></td>
                  <td>{new Date(member.join_date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => openDrawer(member)} className={styles.iconBtn}><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(member.id)} className={styles.iconBtn}><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.mobileCards}>
            {filteredMembers.map(member => (
              <div 
                key={member.id} 
                className={styles.mCard}
                onClick={() => openDrawer(member)}
              >
                <div className={styles.mCardHeader}>
                  <div className={styles.mAvatar}>{member.name.charAt(0)}</div>
                  <div className={styles.mTitle}>
                    <h4>{member.name}</h4>
                    <p>{member.occupation || 'Member'}</p>
                  </div>
                  <div className={styles.mActions}>
                    <button onClick={(e) => {e.stopPropagation(); openDrawer(member)}} className={styles.mEditBtn}><Edit2 size={16}/></button>
                    <button onClick={(e) => {e.stopPropagation(); handleDelete(member.id)}} className={styles.mDeleteBtn}><Trash2 size={16}/></button>
                  </div>
                </div>
                <div className={styles.mCardBody}>
                  <div className={styles.mInfo}><Phone size={14}/> {member.phone}</div>
                  <div className={styles.mInfo}><Sparkles size={14}/> {member.talent || 'General'}</div>
                  <div className={styles.mInfo}>{member.gender}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.fabContainer}>
        <button className={styles.fab} style={{background: '#D4AF37'}} onClick={() => generatePDF('download')} title="Download PDF">
          <Download size={24} />
        </button>
        <button className={styles.fab} style={{background: '#334155'}} onClick={() => generatePDF('preview')} title="Preview PDF">
          <Eye size={24} />
        </button>
        <button className={styles.fab} onClick={() => openDrawer()} title="Add Member">
          <Plus size={24} />
        </button>
      </div>

      {isDrawerOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsDrawerOpen(false)} />
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <h2>{editingId ? 'Edit Member' : 'New Member'}</h2>
              <button className={styles.iconBtn} onClick={() => setIsDrawerOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label><User size={12} /> Full Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                  <label><Mail size={12} /> Email</label>
                  <input name="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="Male">Men</option>
                    <option value="Female">Women</option>
                  </select>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label><Phone size={12} /> Personal Phone</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className={styles.inputGroup}>
                <label><Briefcase size={12} /> Occupation</label>
                <input name="occupation" value={formData.occupation} onChange={handleInputChange} />
              </div>
              <div className={styles.inputGroup}>
                <label><Star size={12} /> Talent / Skill</label>
                <input name="talent" value={formData.talent} onChange={handleInputChange} />
              </div>
              <div className={styles.inputGroup}>
                <label><Calendar size={12} /> Joined Date</label>
                <input type="date" name="join_date" value={formData.join_date} onChange={handleInputChange} required />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Processing...' : 'Save Member'}
              </button>
            </form>
          </div>
        </>
      )}

      {previewUri && (
        <div className={styles.overlay} onClick={() => setPreviewUri(null)} style={{ zIndex: 1001 }}>
          <div className={styles.drawer} style={{width: '90%', maxWidth: '900px', height: '90vh', padding: '0'}}>
             <div className={styles.drawerHeader}>
                <h2>Document Preview</h2>
                <button className={styles.iconBtn} onClick={() => setPreviewUri(null)}><X size={24} /></button>
            </div>
            <iframe src={previewUri} className={styles.pdfViewer} title="PDF Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChurchMembers;
