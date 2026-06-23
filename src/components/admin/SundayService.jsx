import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/SundayService.module.css';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  Tooltip, Legend, ArcElement, PointElement, LineElement 
} from 'chart.js';
import { 
  Printer, Download, Trash2, Users, Search, 
  Plus, BarChart3, History, Calendar, Filter, Phone, MapPin, Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, PointElement, LineElement);

const SundayService = () => {
  const [activeTab, setActiveTab] = useState('entry'); // 'entry', 'analytics', 'history'
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    serviceDate: new Date().toISOString().split('T')[0],
    attendeeName: '',
    origin: '',
    phoneNumber: '',
    category: 'Youth',
    serviceType: 'Main'
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('service_date', { ascending: false });
    if (error) setError(error.message);
    else setRecords(data);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditingRecord({ ...editingRecord, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from('attendance')
      .insert([{ 
        service_date: formData.serviceDate, 
        attendee_name: formData.attendeeName, 
        origin: formData.origin, 
        phone_number: formData.phoneNumber, 
        category: formData.category, 
        service_type: formData.serviceType 
      }])
      .select();
    
    if (error) {
      setError(error.message);
    } else {
      setRecords([data[0], ...records]);
      setFormData({ // Reset form data to initial state
        serviceDate: new Date().toISOString().split('T')[0],
        attendeeName: '',
        origin: '',
        phoneNumber: '',
        category: 'Youth',
        serviceType: 'Main'
      });
      setError(null);
    }
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { id, created_at, ...updateData } = editingRecord;
    const { data, error } = await supabase
      .from('attendance')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) {
      setError(error.message);
    } else {
      setRecords(records.map(r => r.id === id ? data[0] : r));
      setEditingRecord(null);
      setError(null);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Remove this record?")) return;
    const { error } = await supabase.from('attendance').delete().eq('id', id);
    if (!error) setRecords(records.filter(r => r.id !== id));
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
  };

  // Logic: Grouping and Filtering
  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.attendee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.origin?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  const groupedRecords = useMemo(() => {
    return filteredRecords.reduce((acc, record) => {
      const date = record.service_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(record);
      return acc;
    }, {});
  }, [filteredRecords]);

  // Chart Data Preparation
  const categoryCounts = {
    Youth: records.filter(r => r.category === 'Youth').length,
    Women: records.filter(r => r.category === 'Women').length,
    Men: records.filter(r => r.category === 'Men').length,
  };

  const pieData = {
    labels: ['Youth', 'Women', 'Men'],
    datasets: [{
      data: [categoryCounts.Youth, categoryCounts.Women, categoryCounts.Men],
      backgroundColor: ['#D4AF37', '#1A1A1A', '#718096'],
      borderWidth: 0,
    }]
  };

  const handleDownload = (recordsForDate, date) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(26, 26, 26);
    doc.text('PEFA KAWANGWARE 56', 14, 20);
    doc.setFontSize(12);
    doc.text(`Attendance Report: ${date}`, 14, 28);

    autoTable(doc, {
      head: [['Name', 'Origin', 'Phone', 'Category', 'Service']],
      body: recordsForDate.map(r => [r.attendee_name, r.origin, r.phone_number, r.category, r.service_type]),
      startY: 35,
      headStyles: { fillColor: [212, 175, 55] }
    });
    doc.save(`PEFA_Attendance_${date}.pdf`);
  };

  return (
    <div className={styles.adminWrapper}>
      <header className={styles.dashboardHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Ministry Tracker</h1>
          <p className={styles.subtitle}>Sunday Service Attendance & Growth Analytics</p>
        </div>
        
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <Users size={20} className={styles.goldText} />
            <div>
              <span className={styles.statLabel}>Total Database</span>
              <span className={styles.statValue}>{records.length}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Calendar size={20} className={styles.goldText} />
            <div>
              <span className={styles.statLabel}>Recent Sunday</span>
              <span className={styles.statValue}>
                {records[0] ? records.filter(r => r.service_date === records[0].service_date).length : 0}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* TABS NAVIGATION */}
      <nav className={styles.tabNav}>
        <button onClick={() => setActiveTab('entry')} className={activeTab === 'entry' ? styles.activeTab : ''}>
          <Plus size={18} /> Record Entry
        </button>
        <button onClick={() => setActiveTab('analytics')} className={activeTab === 'analytics' ? styles.activeTab : ''}>
          <BarChart3 size={18} /> Analytics
        </button>
        <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? styles.activeTab : ''}>
          <History size={18} /> History
        </button>
      </nav>

      <main className={styles.contentArea}>
        <AnimatePresence mode="wait">
          {activeTab === 'entry' && (
            <motion.div 
              key="entry" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={styles.entryGrid}
            >
              <div className={styles.formCard}>
                <h3>New Attendance Record</h3>
                <form onSubmit={handleSubmit}>
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                      <label>Service Date</label>
                      <input type="date" name="serviceDate" value={formData.serviceDate} onChange={handleInputChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Attendee Full Name</label>
                      <input type="text" name="attendeeName" value={formData.attendeeName} onChange={handleInputChange} placeholder="John Doe" required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Origin / Neighborhood</label>
                      <input type="text" name="origin" value={formData.origin} onChange={handleInputChange} placeholder="e.g. Kawangware 56" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Phone Number</label>
                      <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="07..." />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange}>
                        <option value="Youth">Youth</option>
                        <option value="Women">Women</option>
                        <option value="Men">Men</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Service Type</label>
                      <select name="serviceType" value={formData.serviceType} onChange={handleInputChange}>
                        <option value="Morning">Morning Service</option>
                        <option value="Youth">Youth Service</option>
                        <option value="Main">Main Service</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Processing...' : 'Add to Records'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.analyticsGrid}
            >
              <div className={styles.chartCard}>
                <h4>Demographics Distribution</h4>
                <div className={styles.pieWrapper}>
                   <Pie data={pieData} />
                </div>
              </div>
              <div className={styles.chartCard}>
                <h4>Service Breakdown</h4>
                <Bar data={{
                  labels: ['Morning', 'Youth', 'Main'],
                  datasets: [{
                    label: 'Attendance',
                    data: [
                      records.filter(r => r.service_type === 'Morning').length,
                      records.filter(r => r.service_type === 'Youth').length,
                      records.filter(r => r.service_type === 'Main').length
                    ],
                    backgroundColor: '#D4AF37'
                  }]
                }} />
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.searchStrip}>
                <div className={styles.searchWrapper}>
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name or neighborhood..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {Object.entries(groupedRecords).map(([date, dateRecords]) => (
                <div key={date} className={styles.dateBlock}>
                  <div className={styles.dateHeader}>
                    <h4>{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                    <div className={styles.actionGroup}>
                      <button onClick={() => handleDownload(dateRecords, date)} className={styles.iconBtn} title="Download PDF">
                        <Download size={16} />
                      </button>
                      <span className={styles.badge}>{dateRecords.length} Attendees</span>
                    </div>
                  </div>
                  
                  <div className={styles.tableWrapper}>
                    <table className={styles.modernTable}>
                      <thead>
                        <tr>
                          <th>Attendee</th>
                          <th>Location</th>
                          <th>Category</th>
                          <th>Service</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dateRecords.map(r => (
                          <tr key={r.id}>
                            <td data-label="Attendee">
                              <div className={styles.nameCell}>
                                <strong>{r.attendee_name}</strong>
                                <small><Phone size={10} /> {r.phone_number || 'N/A'}</small>
                              </div>
                            </td>
                            <td data-label="Location">
                              <div className={styles.originCell}>
                                <MapPin size={12}/> {r.origin || 'N/A'}
                              </div>
                            </td>
                            <td data-label="Category">
                              <span className={`${styles.tag} ${styles[r.category.toLowerCase()]}`}>{r.category}</span>
                            </td>
                            <td data-label="Service">{r.service_type}</td>
                            <td data-label="Actions" className={styles.actionCell}>
                              <button onClick={() => handleEdit(r)} className={`${styles.iconBtn} ${styles.editBtn}`}>
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDelete(r.id)} className={`${styles.iconBtn} ${styles.deleteBtn}`}>
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingRecord && (
            <motion.div 
              className={styles.modalBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingRecord(null)}
            >
              <motion.div 
                className={styles.modalContent}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              >
                <h3>Edit Attendance Record</h3>
                <form onSubmit={handleUpdate}>
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                      <label>Service Date</label>
                      <input type="date" name="service_date" value={editingRecord.service_date} onChange={handleEditInputChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Attendee Full Name</label>
                      <input type="text" name="attendee_name" value={editingRecord.attendee_name} onChange={handleEditInputChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Origin / Neighborhood</label>
                      <input type="text" name="origin" value={editingRecord.origin || ''} onChange={handleEditInputChange} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Phone Number</label>
                      <input type="tel" name="phone_number" value={editingRecord.phone_number || ''} onChange={handleEditInputChange} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Category</label>
                      <select name="category" value={editingRecord.category} onChange={handleEditInputChange}>
                        <option value="Youth">Youth</option>
                        <option value="Women">Women</option>
                        <option value="Men">Men</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Service Type</label>
                      <select name="service_type" value={editingRecord.service_type} onChange={handleEditInputChange}>
                        <option value="Morning">Morning Service</option>
                        <option value="Youth">Youth Service</option>
                        <option value="Main">Main Service</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.modalActions}>
                    <button type="button" onClick={() => setEditingRecord(null)} className={styles.cancelBtn}>
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className={styles.submitBtn}>
                      {loading ? 'Updating...' : 'Update Record'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SundayService;
