import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/WebsiteVisits.module.css';
import { Eye } from 'lucide-react';
import CountUp from 'react-countup';

export default function WebsiteVisits({ isDashboard = false }) {
  const [visitCount, setVisitCount] = useState(null);

  useEffect(() => {
    async function trackAndFetchVisits() {
      try {
        const { data, error } = await supabase.rpc('increment_visit_count');
        if (error) {
          console.error('Supabase RPC Error:', error);
          const { data: readData } = await supabase
            .from('visits')
            .select('count')
            .eq('id', 1)
            .single();
          if (readData) setVisitCount(readData.count);
          return;
        }
        setVisitCount(data);
      } catch (err) {
        console.error('Error fetching visit count:', err);
      }
    }

    if (isDashboard) {
        async function fetchVisits() {
            const { data: readData } = await supabase
                .from('visits')
                .select('count')
                .eq('id', 1)
                .single();
            if(readData) setVisitCount(readData.count)
        }
        fetchVisits()
    } else {
        trackAndFetchVisits();
    }
  }, [isDashboard]);

  if (!isDashboard) {
    return (
      <div className={styles.footerContainer}>
        {visitCount !== null ? `Total Visits: ${visitCount}` : ''}
      </div>
    );
  }

  return (
    <div className={styles.dashboardCard}>
        <div className={styles.iconWrapper}>
            <Eye size={24} className={styles.icon} />
        </div>
        <div className={styles.textWrapper}>
            <h3 className={styles.title}>Total Website Visits</h3>
            <p className={styles.count}>
                {visitCount !== null ? 
                    <CountUp end={visitCount} duration={2.5} separator="," /> : 
                    <span className={styles.loader}></span>
                }
            </p>
        </div>
    </div>
  );
}
