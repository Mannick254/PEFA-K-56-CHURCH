import React from 'react';
import Seo from '../components/Seo';
import styles from '../styles/Give.module.css';
import { Heart, Send } from 'lucide-react';
import { FaPaypal, FaUniversity, FaMobileAlt } from 'react-icons/fa';
import Breadcrumb from '../components/Breadcrumb';


const Give = () => {
  const breadcrumbPath = [
    { name: 'Home', path: '/' },
    { name: 'Give' }
  ];

  return (
    <div className={styles.givePage}>
      <Seo 
        title="Give & Partner" 
        description="Your generosity fuels our mission. Support the work of PEFA Kawangware 56 through various giving channels." 
        keywords="give, donate, support, church giving, PEFA Kawangware 56, tithe, offering"
        url="/give"
        type="website"
      />

      <Breadcrumb path={breadcrumbPath} />

      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Partner with Our Mission</h1>
          <p>"Bring the full tithe into the storehouse, that there may be food in my house. And thereby put me to the test, says the Lord of hosts." - Malachi 3:10</p>
        </div>
      </header>

      <main className={styles.container}>
        <section className={styles.intro}>
          <h2>Why We Give</h2>
          <p>
            Giving is an act of worship, a response of gratitude for the grace God has shown us. Your tithes, offerings, and donations are vital for the day-to-day ministry, community outreach, and the advancement of the Gospel through our church. Thank you for your faithful partnership.
          </p>
        </section>

        <section className={styles.waysToGive}>
          <h2>Ways to Give</h2>
          <div className={styles.giveGrid}>
            {/* M-Pesa */}
            <div className={styles.giveCard}>
              <div className={`${styles.cardIcon} ${styles.mpesa}`}>
                <FaMobileAlt />
              </div>
              <h3>M-Pesa</h3>
              <p>The simplest way to give in Kenya. Use the details below.</p>
              <div className={styles.details}>
                <p><strong>Lipa na M-Pesa:</strong></p>
                <p>Paybill: <strong>400200</strong></p>
                <p>Account No: <strong>1652142</strong></p>
                <hr/>
                <p><strong>Or send directly to:</strong></p>
                <p>M-Pesa Number: <strong>0745 333 882</strong></p>
                <p>Name: <strong>Daniel Ramogi</strong></p>
              </div>
            </div>

            {/* Bank Deposit */}
            <div className={styles.giveCard}>
              <div className={`${styles.cardIcon} ${styles.bank}`}>
                <FaUniversity />
              </div>
              <h3>Bank Transfer</h3>
              <p>You can give directly to our church bank account via deposit or transfer.</p>
              <div className={styles.details}>
                <p><strong>Bank Name:</strong> Co-operative Bank</p>
                <p><strong>Account Name:</strong> PEFA CHURCH Kawangware 56</p>
                <p><strong>Account Number:</strong> 01128514279100</p>
                <p><strong>Branch:</strong> 46 Kawangware</p>
              </div>
            </div>
            
            {/* In Person */}
            <div className={styles.giveCard}>
              <div className={`${styles.cardIcon} ${styles.person}`}>
                <Heart />
              </div>
              <h3>In Person</h3>
              <p>You can give during any of our worship services via cash or cheque. Offering envelopes are available for your convenience.</p>
              <div className={styles.details}>
                  <p>Place your gift in the offering basket during our Sunday services or drop it at the church office during the week.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.thankYou}>
          <Send size={40}/>
          <h2>Thank You for Your Generosity</h2>
          <p>Your contribution makes a difference. If you have any questions about giving, please don't hesitate to <a href="/contact">contact us</a>.</p>
        </section>

      </main>
    </div>
  );
};

export default Give;