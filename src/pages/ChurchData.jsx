import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/ChurchData.module.css';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler
} from 'chart.js';
import CountUp from 'react-countup';
import WebsiteVisits from '../components/WebsiteVisits';

// Register Chart.js components
ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, 
  BarElement, PointElement, LineElement, Title, Filler
);

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
};

const ChurchData = () => {
  const [data, setData] = useState({
    members: [],
    youth: [],
    children: [],
    attendance: [],
    visitors: []
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllColumns, setShowAllColumns] = useState(false);
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();

  const handleUnauthorized = useCallback(async () => {
    sessionStorage.removeItem('hasDataAccess');
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (signOutErr) {
      console.warn('Signout error:', signOutErr?.message);
    } finally {
      navigate('/data-login', { replace: true });
    }
  }, [navigate]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [membersRes, youthRes, childrenRes, attendanceRes, visitorsRes] = await Promise.all([
        supabase.from('members').select('*'),
        supabase.from('youth').select('*'),
        supabase.from('children').select('*'),
        supabase.from('attendance').select('*').order('service_date', { ascending: true }),
        supabase.from('visitors').select('*').order('visit_date', { ascending: true })
      ]);

      const responses = [
        { name: 'members', res: membersRes },
        { name: 'youth', res: youthRes },
        { name: 'children', res: childrenRes },
        { name: 'attendance', res: attendanceRes },
        { name: 'visitors', res: visitorsRes }
      ];

      const loadedData = {};
      const errors = [];

      responses.forEach(item => {
        if (item.res.error) {
          errors.push(`Failed to load ${item.name}: ${item.res.error.message}`);
          loadedData[item.name] = [];
          console.error(`Error fetching ${item.name}:`, item.res.error);
        } else {
          loadedData[item.name] = item.res.data || [];
        }
      });
      
      setData(loadedData);

      if (errors.length > 0) {
        setError(`Could not load all data. Errors: ${errors.join(', ')}`);
      }

    } catch (err) {
      console.error('Data loading error:', err);
      setError('A network error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const verifyAuthAndLoad = async () => {
       try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) {
          if (isMounted) await handleUnauthorized();
          return;
        }

        const { data: creds, error: roleError } = await supabase
          .from('data_credentials')
          .select('role')
          .ilike('email', session.user.email)
          .maybeSingle();

        if (roleError) console.warn('Credentials query note:', roleError.message);

        const hasDataAccess = sessionStorage.getItem('hasDataAccess') === 'true';
        if (!hasDataAccess && creds?.role !== 'admin') {
          if (isMounted) await handleUnauthorized();
          return;
        }

        if (isMounted) await fetchAllData();

      } catch (err) {
        const errMsg = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
        console.error('Session authorization error:', errMsg);
        if (isMounted) await handleUnauthorized();
      }
    };
    verifyAuthAndLoad();
    return () => { isMounted = false; };
  }, [handleUnauthorized, fetchAllData]);

  const analyticsData = useMemo(() => {
    const totalMembers = data.members.length;
    const totalYouth = data.youth.length;
    const totalChildren = data.children.length;
    const totalCongregation = totalMembers + totalYouth + totalChildren;

    const adultsAndYouth = [...data.members, ...data.youth];
    const genderCounts = adultsAndYouth.reduce((acc, person) => {
      const gender = person.gender?.toLowerCase();
      if (gender === 'male') {
        acc.male = (acc.male || 0) + 1;
      } else if (gender === 'female') {
        acc.female = (acc.female || 0) + 1;
      }
      return acc;
    }, { male: 0, female: 0 });

    const congregationChartData = {
      labels: ['Male', 'Female', 'Children'],
      datasets: [{
        data: [genderCounts.male, genderCounts.female, totalChildren],
        backgroundColor: ['#3b82f6', '#ec4899', '#f59e0b'],
        hoverBackgroundColor: ['#2563eb', '#db2777', '#d97706']
      }]
    };

    const attendanceByDate = data.attendance.reduce((acc, record) => {
      const date = record.service_date;
      if (!date) return acc;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const sortedDates = Object.keys(attendanceByDate).sort((a, b) => new Date(a) - new Date(b));
    const recentDates = sortedDates.slice(-10);

    const attendanceChartData = {
      labels: recentDates.map(date => new Date(date).toLocaleDateString()),
      datasets: [{
        label: 'Total Attendance',
        data: recentDates.map(date => attendanceByDate[date]),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.3
      }]
    };
    
    return { totalCongregation, congregationChartData, attendanceChartData };
  }, [data]);

  const handleLogout = async () => {
    await handleUnauthorized();
  };

  const currentList = data[activeTab] || [];
  const filteredData = currentList.filter((item) =>
    Object.values(item).some((val) =>
      String(val ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const essentialColumns = ['name', 'phone', 'gender', 'talent'];
  const getVisibleColumns = (item) => {
    if (showAllColumns) return Object.keys(item);
    const visible = essentialColumns.filter(key => key in item);
    if (visible.length === 0) return Object.keys(item); // Fallback to show all if no essential columns are present
    return visible;
  };
  
  const doughnutChartOptions = {
    plugins: {
      legend: {
        display: windowWidth >= 768,
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            if (value === null || value === undefined) return label;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
            return `${label}: ${percentage}`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };
  
  const lineChartOptions = {
    plugins: { legend: { display: true } },
    maintainAspectRatio: false
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Verifying access & loading records...</p>
      </div>
    );
  }
  
  const isDesktop = windowWidth >= 768;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Church Management Dashboard</h1>
          <p className={styles.subtitle}>Authorized Admin Data Access</p>
        </div>
        <button onClick={handleLogout} className={styles.signOutBtn}>
          Sign Out
        </button>
      </header>

      <main className={styles.container}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.tabs}>
          {['dashboard', 'members', 'youth', 'children', 'attendance', 'visitors'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? styles.activeTab : styles.tab}
            >
              <span>{tab}</span>
              {tab !== 'dashboard' && (
                <span className={styles.badge}>{data[tab]?.length || 0}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' ? (
          <section className={styles.dashboardGrid}>
             <div className={`${styles.statCard} ${styles.totalCard}`}>
                <h3>Total Congregation</h3>
                <p className={styles.statNumber}>
                    <CountUp end={analyticsData.totalCongregation} duration={2} />
                </p>
                <p className={styles.statSub}>Members + Youth + Children</p>
            </div>
            <div className={styles.statCard}>
              <WebsiteVisits isDashboard={true} />
            </div>
            <div className={styles.statCard}>
                <h3>Congregation Composition</h3>
                <div className={styles.chartWrapper} style={{height: '150px'}}>
                    <Doughnut data={analyticsData.congregationChartData} options={doughnutChartOptions} />
                </div>
            </div>
            <div className={`${styles.statCard} ${styles.fullWidthCard}`}>
                <h3>Recent Attendance Trend</h3>
                 <div className={styles.chartWrapper} style={{height: '250px'}}>
                    <Line data={analyticsData.attendanceChartData} options={lineChartOptions} />
                </div>
            </div>
          </section>
        ) : (
          <>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <button onClick={() => setShowAllColumns(!showAllColumns)} className={styles.toggleColumnsBtn}>
                {showAllColumns ? 'Show Less' : 'Show More'}
              </button>
            </div>

            {filteredData.length === 0 ? (
              <div className={styles.noRecords}>No matching records found.</div>
            ) : isDesktop ? (
              <div className={styles.tableWrapper} style={{ display: 'block' }}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      {filteredData.length > 0 && getVisibleColumns(filteredData[0]).map((key) => (
                        <th key={key}>{key.replace('_', ' ')}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {filteredData.map((row, index) => (
                      <tr key={row.id || index}>
                        {getVisibleColumns(row).map(key => (
                          <td key={key}>
                            {key === 'gender' ? (
                              <span className={styles[`gender${row[key]?.charAt(0).toUpperCase() + row[key]?.slice(1)}`]}>
                                {row[key]}
                              </span>
                            ) : typeof row[key] === 'object' && row[key] !== null ? (
                              JSON.stringify(row[key])
                            ) : (
                              String(row[key] ?? '-')
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.cardList}>
                {filteredData.map((row, index) => (
                  <div key={row.id || index} className={styles.dataCard}>
                    {getVisibleColumns(row).map(key => (
                      <div key={key} className={styles.cardField}>
                        <strong>{key.replace('_', ' ')}</strong>
                        <span>
                          {key === 'gender' ? (
                            <span className={styles[`gender${row[key]?.charAt(0).toUpperCase() + row[key]?.slice(1)}`]}>
                              {row[key]}
                            </span>
                          ) : typeof row[key] === 'object' && row[key] !== null ? (
                            JSON.stringify(row[key])
                          ) : (
                            String(row[key] ?? '-')
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ChurchData;