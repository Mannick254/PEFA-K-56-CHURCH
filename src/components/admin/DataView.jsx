// src/components/admin/DataView.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/DataView.module.css';
import { FaSync, FaSearch, FaTimes, FaPlus, FaMale, FaFemale, FaChild, FaUsers } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import CountUp from 'react-countup';

ChartJS.register(ArcElement, Tooltip, Legend);

// Mock avatar generator
const getAvatar = (name) => {
    const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?';
    return <div className={styles.avatar}>{initials}</div>;
};

const DataView = () => {
    const [activeTab, setActiveTab] = useState('members');
    const [data, setData] = useState({ members: [], youth: [], children: [], sunday_service: [], visitors: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const tabs = [
        { id: 'members', label: 'Members', icon: <FaUsers /> },
        { id: 'youth', label: 'Youth', icon: <FaChild /> },
        { id: 'children', label: 'Children', icon: <FaChild /> },
        { id: 'sunday_service', label: 'Attendance', icon: <FaUsers /> },
        { id: 'visitors', label: 'Visitors', icon: <FaUsers /> }
    ];

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            const results = await Promise.all([
                supabase.from('members').select('*').order('join_date', { ascending: false }),
                supabase.from('youth').select('*').order('join_date', { ascending: false }),
                supabase.from('children').select('*').order('join_date', { ascending: false }),
                supabase.from('sunday_service').select('*').order('date', { ascending: false }),
                supabase.from('visitors').select('*').order('visit_date', { ascending: false })
            ]);
            setData({
                members: results[0].data || [],
                youth: results[1].data || [],
                children: results[2].data || [],
                sunday_service: results[3].data || [],
                visitors: results[4].data || []
            });
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data[activeTab]?.filter(item => {
        const searchStr = searchTerm.toLowerCase();
        if (!item) return false;
        return Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchStr)
        );
    }) || [];

    const getDemographics = () => {
        const adultCount = data.members.length;
        const youthCount = data.youth.length;
        const childrenCount = data.children.length;
        const total = adultCount + youthCount + childrenCount;
        return {
            labels: ['Adults', 'Youth', 'Children'],
            datasets: [{
                data: [adultCount, youthCount, childrenCount],
                backgroundColor: ['#004a99', '#ffc107', '#28a745'],
                borderWidth: 0,
            }],
            total,
            adultCount,
            youthCount,
            childrenCount
        };
    };

    const demoData = getDemographics();

    const renderDrawer = () => {
        if (!selectedItem) return null;
        let fields = [];
         switch (activeTab) {
      case 'sunday_service':
        fields = [
          { label: 'Attendance', value: selectedItem.total_attendance },
          { label: 'Men', value: selectedItem.men_count },
          { label: 'Women', value: selectedItem.women_count },
          { label: 'Children', value: selectedItem.children_count },
          { label: 'Theme', value: selectedItem.theme }
        ];
        break;
      case 'visitors':
        fields = [
          { label: 'Visit Date', value: selectedItem.visit_date },
          { label: 'Phone', value: selectedItem.phone },
          { label: 'Origin', value: selectedItem.origin },
          { label: 'Category', value: selectedItem.category },
          { label: 'Invited By', value: selectedItem.invited_by },
          { label: 'Remarks', value: selectedItem.remarks }
        ];
        break;
      case 'children':
        fields = [
          { label: 'Birth Date', value: selectedItem.birth_date },
          { label: 'Join Date', value: selectedItem.join_date },
          { label: 'Guardian', value: selectedItem.parent_name },
          { label: 'Phone', value: selectedItem.phone },
          { label: 'Talent', value: selectedItem.talent }
        ];
        break;
      default: // members and youth
        fields = [
          { label: 'Join Date', value: selectedItem.join_date },
          { label: 'Phone', value: selectedItem.phone },
          { label: 'Email', value: selectedItem.email },
          { label: 'Occupation', value: selectedItem.occupation },
          { label: 'Talent', value: selectedItem.talent }
        ];
    }


        return (
            <>
                <div className={styles.overlay} onClick={() => setSelectedItem(null)}></div>
                <div className={styles.drawer}>
                    <div className={styles.drawerHeader}>
                        <h2>Details</h2>
                        <button className={styles.iconBtn} onClick={() => setSelectedItem(null)}><FaTimes /></button>
                    </div>
                    {fields.map((field, index) => (
                         <div className={styles.inputGroup} key={index}>
                            <label>{field.label}</label>
                            <p>{field.value || 'N/A'}</p>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className={styles.dashboard}>
            {renderDrawer()}

            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>Data Explorer</h1>
                    <p>Live congregation data & analytics</p>
                </div>
                <div className={styles.desktopActions}>
                    <button className={styles.secondaryBtn} onClick={fetchAllData}>
                        <FaSync className={loading ? styles.spin : ''} />
                        <span>Refresh</span>
                    </button>
                    <button className={styles.primaryBtn}>
                        <FaPlus />
                        <span>Add New</span>
                    </button>
                </div>
            </header>

            <section className={styles.analyticsSection}>
                <div className={styles.statCard}>
                    <div className={styles.chartWrapper}>
                        <Doughnut data={demoData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                         <div className={styles.centerCount}><CountUp end={demoData.total} duration={2} /></div>
                    </div>
                     <div>
                        <h3>Congregation</h3>
                        <p>Total registered members</p>
                    </div>
                </div>
                 <div className={styles.statCard}><FaMale /><div><h3>Adults</h3><p>{demoData.adultCount}</p></div></div>
                <div className={styles.statCard}><FaChild /><div><h3>Youth</h3><p>{demoData.youthCount}</p></div></div>
                 <div className={styles.statCard}><FaUsers/><div><h3>Children</h3><p>{demoData.childrenCount}</p></div></div>
            </section>

            <div className={styles.stickySearch}>
                <div className={styles.searchWrapper}>
                    <FaSearch style={{ color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder={`Search in ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.chipFilter}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                            className={activeTab === tab.id ? styles.activeChip : styles.chip}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                <>
                    <div className={styles.desktopTable}>
                        <table className={styles.modernTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Join Date</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(item => (
                                    <tr key={item.id} onClick={() => setSelectedItem(item)}>
                                        <td>
                                            <div className={styles.userCell}>
                                                {getAvatar(item.name)}
                                                <div>
                                                    <strong>{item.name || `Service on ${item.date}`}</strong>
                                                    <br/>
                                                    <small>{item.category || ''}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.phone || item.email || 'N/A'}</td>
                                        <td>{item.join_date || item.visit_date || 'N/A'}</td>
                                        <td><span className={styles.badge}>Active</span></td>
                                        <td><button className={styles.secondaryBtn} onClick={(e) => {e.stopPropagation(); setSelectedItem(item);}}>Details</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.mobileCards}>
                        {filteredData.map(item => (
                            <div key={item.id} className={styles.mCard} onClick={() => setSelectedItem(item)}>
                                <div className={styles.mCardHeader}>
                                    <div className={styles.mAvatar}>{getAvatar(item.name)}</div>
                                    <div className={styles.mTitle}>
                                        <h4>{item.name || `Service on ${item.date}`}</h4>
                                        <p>{item.phone || 'No contact'}</p>
                                    </div>
                                </div>
                                <div className={styles.mCardBody}>
                                    <div className={styles.mInfo}>
                                        <strong>Join Date:</strong><br/>{item.join_date || item.visit_date || 'N/A'}
                                    </div>
                                     <div className={styles.mInfo}>
                                        <strong>Status:</strong><br/><span className={styles.badge}>Active</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
             <button className={styles.fab}><FaPlus /></button>
        </div>
    );
};

export default DataView;
