// src/components/admin/DataView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/DataView.module.css';
import '../../styles/Skeleton.css';
import { 
    FaSync, FaSearch, FaTimes, FaPlus, FaMale, FaFemale, FaChild, 
    FaUsers, FaDownload, FaFilter, FaEdit, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import CountUp from 'react-countup';

ChartJS.register(ArcElement, Tooltip, Legend);

const getAvatar = (name) => {
    const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?';
    return <div className={styles.avatar}>{initials}</div>;
};

const SkeletonRow = () => (
    <tr>
        <td>
            <div className={styles.userCell}>
                <div className="skeleton skeleton-avatar"></div>
                <div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
                </div>
            </div>
        </td>
        <td><div className="skeleton skeleton-text"></div></td>
        <td><div className="skeleton skeleton-text"></div></td>
        <td><div className="skeleton skeleton-text"></div></td>
        <td><div className="skeleton skeleton-button"></div></td>
    </tr>
);

const SkeletonCard = () => (
    <div className={styles.mCard}>
        <div className={styles.mCardHeader}>
            <div className="skeleton skeleton-avatar"></div>
            <div className={styles.mTitle}>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
            </div>
        </div>
        <div className={styles.mCardBody}>
            <div className={styles.mInfo}>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
            </div>
        </div>
    </div>
);

const DataView = () => {
    const [activeTab, setActiveTab] = useState('members');
    const [data, setData] = useState({ members: [], youth: [], children: [], sunday_service_attendance: [], visitors: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // Modal & Edit State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({});

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const tabs = [
        { id: 'members', label: 'Members', icon: <FaUsers /> },
        { id: 'youth', label: 'Youth', icon: <FaChild /> },
        { id: 'children', label: 'Children', icon: <FaChild /> },
        { id: 'sunday_service_attendance', label: 'Attendance', icon: <FaUsers /> },
        { id: 'visitors', label: 'Visitors', icon: <FaUsers /> }
    ];

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [membersRes, youthRes, childrenRes, serviceRes, visitorsRes] = await Promise.all([
                supabase.from('members').select('*').order('join_date', { ascending: false }),
                supabase.from('youth').select('*').order('join_date', { ascending: false }),
                supabase.from('children').select('*').order('join_date', { ascending: false }),
                supabase.from('sunday_service_attendance').select('*').order('service_date', { ascending: false }),
                supabase.from('visitors').select('*').order('visit_date', { ascending: false })
            ]);

            if (membersRes.error) console.error('Members table error:', membersRes.error);
            if (youthRes.error) console.error('Youth table error:', youthRes.error);
            if (childrenRes.error) console.error('Children table error:', childrenRes.error);
            if (serviceRes.error) console.error('Attendance table error:', serviceRes.error);
            if (visitorsRes.error) console.error('Visitors table error:', visitorsRes.error);

            const hasAnyError = membersRes.error || youthRes.error || childrenRes.error || serviceRes.error || visitorsRes.error;

            if (hasAnyError) {
                setError('One or more tables failed to load. Check browser console for details.');
            }
            
            setData({
                members: membersRes.data || [],
                youth: youthRes.data || [],
                children: childrenRes.data || [],
                sunday_service_attendance: serviceRes.data || [],
                visitors: visitorsRes.data || []
            });
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Fetch operation unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredData = useMemo(() => {
        const rawTab = data[activeTab] || [];
        return rawTab.filter(item => {
            if (!item) return false;
            const searchStr = searchTerm.toLowerCase();

            // Search Filter
            let matchesSearch = false;
            if (activeTab === 'sunday_service_attendance') {
                matchesSearch = (item.attendee_name && item.attendee_name.toLowerCase().includes(searchStr)) ||
                                (item.service_date && item.service_date.toLowerCase().includes(searchStr));
            } else {
                matchesSearch = Object.values(item).some(val => String(val).toLowerCase().includes(searchStr));
            }

            // Category Filter
            let matchesCategory = true;
            if (categoryFilter !== 'ALL' && item.category) {
                matchesCategory = item.category.toLowerCase() === categoryFilter.toLowerCase();
            }

            return matchesSearch && matchesCategory;
        });
    }, [data, activeTab, searchTerm, categoryFilter]);

    // Reset pagination when tab or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm, categoryFilter]);

    // Paginated Sliced Data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

    // Analytics Calculation
    const demoData = useMemo(() => {
        const adultCount = data.members.length;
        const youthCount = data.youth.length;
        const childrenCount = data.children.length;
        const visitorCount = data.visitors.length;
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
            childrenCount,
            visitorCount
        };
    }, [data]);

    // CSV Export Feature
    const exportToCSV = () => {
        if (!filteredData.length) return;
        const headers = Object.keys(filteredData[0]).join(',');
        const rows = filteredData.map(row => 
            Object.values(row).map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
        );
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${activeTab}_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Modal Handlers
    const handleOpenModal = (item = null) => {
        setEditItem(item);
        if (item) {
            setFormData({ ...item });
        } else {
            setFormData({});
        }
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const targetTable = activeTab;

        try {
            if (editItem) {
                const { error } = await supabase.from(targetTable).update(formData).eq('id', editItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from(targetTable).insert([formData]);
                if (error) throw error;
            }
            setIsModalOpen(false);
            fetchAllData();
        } catch (err) {
            console.error('Error saving record:', err);
            alert('Failed to save record: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // UI Drawer Component
    const renderDrawer = () => {
        if (!selectedItem) return null;
        let fields = [];

        switch (activeTab) {
            case 'sunday_service_attendance':
                fields = [
                    { label: 'Date', value: selectedItem.service_date },
                    { label: 'Name', value: selectedItem.attendee_name },
                    { label: 'Origin', value: selectedItem.origin },
                    { label: 'Phone Number', value: selectedItem.phone_number },
                    { label: 'Category', value: selectedItem.category },
                    { label: 'Service Type', value: selectedItem.service_type },
                ];
                break;
            case 'visitors':
                fields = [
                    { label: 'Visit Date', value: selectedItem.visit_date },
                    { label: 'Name', value: selectedItem.name },
                    { label: 'Phone', value: selectedItem.phone },
                    { label: 'Origin', value: selectedItem.origin },
                    { label: 'Category', value: selectedItem.category },
                    { label: 'Invited By', value: selectedItem.invited_by },
                    { label: 'Remarks', value: selectedItem.remarks }
                ];
                break;
            case 'children':
                fields = [
                    { label: 'Name', value: selectedItem.name },
                    { label: 'Birth Date', value: selectedItem.birth_date },
                    { label: 'Join Date', value: selectedItem.join_date },
                    { label: 'Guardian', value: selectedItem.parent_name },
                    { label: 'Phone', value: selectedItem.phone },
                    { label: 'Talent', value: selectedItem.talent }
                ];
                break;
            default:
                fields = [
                    { label: 'Name', value: selectedItem.name },
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
                        <h2>Details for {selectedItem.name || selectedItem.attendee_name}</h2>
                        <button className={styles.iconBtn} onClick={() => setSelectedItem(null)}><FaTimes /></button>
                    </div>
                    {fields.map((field, index) => (
                        <div className={styles.inputGroup} key={index}>
                            <label>{field.label}</label>
                            <p>{field.value || 'N/A'}</p>
                        </div>
                    ))}
                    <button className={styles.primaryBtn} style={{ marginTop: '20px', width: '100%' }} onClick={() => { setSelectedItem(null); handleOpenModal(selectedItem); }}>
                        <FaEdit /> Edit Record
                    </button>
                </div>
            </>
        );
    };

    // Modal UI for Adding / Editing
    const renderModal = () => {
        if (!isModalOpen) return null;

        return (
            <>
                <div className={styles.overlay} onClick={() => setIsModalOpen(false)}></div>
                <div className={styles.drawer} style={{ maxWidth: '500px', margin: 'auto' }}>
                    <div className={styles.drawerHeader}>
                        <h2>{editItem ? 'Edit Record' : 'Add New Record'} ({activeTab})</h2>
                        <button className={styles.iconBtn} onClick={() => setIsModalOpen(false)}><FaTimes /></button>
                    </div>
                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                        {activeTab === 'sunday_service_attendance' ? (
                            <>
                                <input type="text" placeholder="Attendee Name" value={formData.attendee_name || ''} onChange={(e) => setFormData({ ...formData, attendee_name: e.target.value })} required />
                                <input type="date" value={formData.service_date || ''} onChange={(e) => setFormData({ ...formData, service_date: e.target.value })} required />
                                <input type="text" placeholder="Phone Number" value={formData.phone_number || ''} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
                                <input type="text" placeholder="Origin" value={formData.origin || ''} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} />
                                <input type="text" placeholder="Category" value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                            </>
                        ) : (
                            <>
                                <input type="text" placeholder="Full Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                <input type="text" placeholder="Phone" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                <input type="email" placeholder="Email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                <input type="date" placeholder="Join/Visit Date" value={formData.join_date || formData.visit_date || ''} onChange={(e) => setFormData({ ...formData, join_date: e.target.value, visit_date: e.target.value })} />
                            </>
                        )}
                        <button type="submit" className={styles.primaryBtn} style={{ marginTop: '10px' }}>Save Changes</button>
                    </form>
                </div>
            </>
        );
    };

    const renderDesktopTable = () => {
        if (activeTab === 'sunday_service_attendance') {
            return (
                <table className={styles.modernTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Origin</th>
                            <th>Phone</th>
                            <th>Category</th>
                            <th>Service Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map(item => (
                            <tr key={item.id} onClick={() => setSelectedItem(item)}>
                                <td>{item.service_date}</td>
                                <td>{item.attendee_name}</td>
                                <td>{item.origin || 'N/A'}</td>
                                <td>{item.phone_number || 'N/A'}</td>
                                <td>{item.category || 'N/A'}</td>
                                <td>{item.service_type || 'N/A'}</td>
                                <td>
                                    <button className={styles.secondaryBtn} onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}>Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        return (
            <table className={styles.modernTable}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map(item => (
                        <tr key={item.id} onClick={() => setSelectedItem(item)}>
                            <td>
                                <div className={styles.userCell}>
                                    {getAvatar(item.name)}
                                    <div>
                                        <strong>{item.name}</strong>
                                        <br />
                                        <small>{item.category || ''}</small>
                                    </div>
                                </div>
                            </td>
                            <td>{item.phone || item.email || 'N/A'}</td>
                            <td>{item.join_date || item.visit_date || 'N/A'}</td>
                            <td><span className={styles.badge}>Active</span></td>
                            <td>
                                <button className={styles.secondaryBtn} onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderMobileCards = () => {
        if (activeTab === 'sunday_service_attendance') {
            return paginatedData.map(item => (
                <div key={item.id} className={styles.mCard} onClick={() => setSelectedItem(item)}>
                    <div className={styles.mCardHeader}>
                        <div className={styles.mTitle}>
                            <h4>{item.attendee_name}</h4>
                            <p>Service on {item.service_date}</p>
                        </div>
                    </div>
                    <div className={styles.mCardBody}>
                        <div className={styles.mInfo}>
                            <strong>Category:</strong><br />{item.category || 'N/A'}
                        </div>
                        <div className={styles.mInfo}>
                            <strong>Service Type:</strong><br />{item.service_type || 'N/A'}
                        </div>
                    </div>
                </div>
            ));
        }
        return paginatedData.map(item => (
            <div key={item.id} className={styles.mCard} onClick={() => setSelectedItem(item)}>
                <div className={styles.mCardHeader}>
                    <div className={styles.mAvatar}>{getAvatar(item.name)}</div>
                    <div className={styles.mTitle}>
                        <h4>{item.name}</h4>
                        <p>{item.phone || 'No contact'}</p>
                    </div>
                </div>
                <div className={styles.mCardBody}>
                    <div className={styles.mInfo}>
                        <strong>Join Date:</strong><br />{item.join_date || item.visit_date || 'N/A'}
                    </div>
                    <div className={styles.mInfo}>
                        <strong>Status:</strong><br /><span className={styles.badge}>Active</span>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className={styles.dashboard}>
            {renderDrawer()}
            {renderModal()}

            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>Data Explorer</h1>
                    <p>Live congregation data & analytics</p>
                </div>
                <div className={styles.desktopActions}>
                    <button className={styles.secondaryBtn} onClick={exportToCSV}>
                        <FaDownload />
                        <span>Export CSV</span>
                    </button>
                    <button className={styles.secondaryBtn} onClick={fetchAllData}>
                        <FaSync className={loading ? styles.spin : ''} />
                        <span>Refresh</span>
                    </button>
                    <button className={styles.primaryBtn} onClick={() => handleOpenModal(null)}>
                        <FaPlus />
                        <span>Add New</span>
                    </button>
                </div>
            </header>

            {/* Live Analytics Banner */}
            <section className={styles.analyticsSection}>
                <div className={styles.statCard}>
                    <div className={styles.chartWrapper}>
                        <Doughnut data={demoData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                        <div className={styles.centerCount}><CountUp end={demoData.total} duration={1.5} /></div>
                    </div>
                    <div>
                        <h3>Congregation</h3>
                        <p>Total registered members</p>
                    </div>
                </div>
                <div className={styles.statCard}><FaMale /><div><h3>Adults</h3><p>{demoData.adultCount}</p></div></div>
                <div className={styles.statCard}><FaChild /><div><h3>Youth</h3><p>{demoData.youthCount}</p></div></div>
                <div className={styles.statCard}><FaUsers /><div><h3>Children</h3><p>{demoData.childrenCount}</p></div></div>
                <div className={styles.statCard}><FaUsers /><div><h3>Visitors</h3><p>{demoData.visitorCount}</p></div></div>
            </section>

            {/* Filter and Search Bar */}
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
                <div className={styles.filterGroup}>
                    <FaFilter style={{ color: 'var(--text-muted)', marginLeft: '10px' }} />
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={styles.selectFilter}>
                        <option value="ALL">All Categories</option>
                        <option value="Member">Member</option>
                        <option value="Visitor">Visitor</option>
                        <option value="Leader">Leader</option>
                    </select>
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

            {loading ? (
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
                                {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.mobileCards}>
                        {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                </>
            ) : error ? <p className={styles.errorMessage} style={{ color: '#d9534f', padding: '10px 0' }}>{error}</p> : (
                <>
                    <div className={styles.desktopTable}>
                        {renderDesktopTable()}
                    </div>

                    <div className={styles.mobileCards}>
                        {renderMobileCards()}
                    </div>

                    {/* Pagination Bar */}
                    <div className={styles.paginationBar} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                        <span>Page {currentPage} of {totalPages} ({filteredData.length} records)</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className={styles.secondaryBtn} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                <FaChevronLeft /> Prev
                            </button>
                            <button className={styles.secondaryBtn} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                                Next <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </>
            )}
            <button className={styles.fab} onClick={() => handleOpenModal(null)}><FaPlus /></button>
        </div>
    );
};

export default DataView;