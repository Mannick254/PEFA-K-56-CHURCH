import React, { useState } from 'react';
import Seo from '../components/Seo';
import styles from '../styles/Give.modern.module.css';
import { Heart, Send, Loader2, Smartphone, Landmark, CheckCircle, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react'; 
import axios from 'axios'; 

const Give = () => {
  // State for the M-Pesa form
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle M-Pesa STK Push trigger
  const handleMpesaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Client-side phone formatting validation
    let formattedPhone = phoneNumber.trim().replace(/\s+/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+254')) {
      formattedPhone = formattedPhone.substring(1);
    }

    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      setMessage({ type: 'error', text: 'Please enter a valid Safaricom phone number (e.g., 0712345678).' });
      setLoading(false);
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount.' });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/mpesa/stkpush', {
        phoneNumber: formattedPhone,
        amount: amount
      });

      if (response.data.ResponseCode === "0") {
        setMessage({ 
          type: 'success', 
          text: 'STK Push sent! Please check your phone and enter your M-Pesa PIN.' 
        });
        setPhoneNumber('');
        setAmount('');
      } else {
        setMessage({ type: 'error', text: 'Failed to initiate payment. Please try again.' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'A network error occurred. Please try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.givePage}>
      <Seo 
        title="Give & Partner" 
        description="Your generosity fuels our mission. Support the work of PEFA Kawangware 56 through various giving channels." 
        keywords="give, donate, support, church giving, PEFA Kawangware 56, tithe, offering"
        url="/give"
        type="website"
      />

      {/* Hero Banner Section */}
      <header className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Generosity & Faith</span>
          <h1>Partner with Our Mission</h1>
          <p className={styles.scripture}>
            "Bring the full tithe into the storehouse, that there may be food in my house. And thereby put me to the test, says the Lord of hosts."
          </p>
          <span className={styles.scriptureRef}>— Malachi 3:10</span>
        </div>
      </header>

      <main className={styles.container}>
        {/* Mission Statement Feature */}
        <section className={styles.intro}>
          <div className={styles.introContent}>
            <h2>Why We Give</h2>
            <p>
              Giving is an act of worship—a response of gratitude for the grace God has shown us. Your tithes, offerings, and donations fuel essential day-to-day ministry, community outreach, and the advancement of the Gospel.
            </p>
          </div>
        </section>

        {/* Giving Methods Grid Layout */}
        <section className={styles.waysToGive}>
          <div className={styles.sectionHeader}>
            <h2>Ways to Give</h2>
            <p>Select your preferred platform to complete your donation</p>
          </div>

          <div className={styles.giveGrid}>
            {/* Featured M-Pesa Direct Module */}
            <div className={styles.giveCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.mpesa}`}>
                  <Smartphone size={24} />
                </div>
                <div>
                  <span className={styles.tag}>Instant Prompt</span>
                  <h3>M-Pesa Express</h3>
                </div>
              </div>
              
              <p className={styles.cardDesc}>
                Enter your details to receive an automated PIN prompt directly on your handset.
              </p>
              
              <form onSubmit={handleMpesaSubmit} className={styles.mpesaForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <div className={styles.inputWrapper}>
                    <input 
                      type="tel" 
                      id="phoneNumber"
                      placeholder="e.g. 0712345678" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="amount">Amount (KES)</label>
                  <div className={styles.inputWrapper}>
                    <input 
                      type="number" 
                      id="amount"
                      placeholder="Amount to give" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {message.text && (
                  <div className={`${styles.formMessage} ${styles[message.type]}`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{message.text}</span>
                  </div>
                )}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className={styles.spinner} size={18} /> 
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Give via M-Pesa</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className={styles.divider}>
                <span>Manual Payment Option</span>
              </div>
              
              <div className={styles.detailsList}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Paybill Number</span>
                  <span className={styles.detailValue}>400200 <small>(Co-op Bank)</small></span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Account No</span>
                  <span className={styles.detailValue}>1652142</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Direct M-Pesa</span>
                  <span className={styles.detailValue}>0745 333 882</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Recipient Name</span>
                  <span className={styles.detailValue}>Daniel Ramogi</span>
                </div>
              </div>
            </div>

            {/* Bank Wire Details */}
            <div className={styles.giveCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.bank}`}>
                  <Landmark size={24} />
                </div>
                <h3>Bank Transfer</h3>
              </div>
              
              <p className={styles.cardDesc}>
                Directly deposit into or transfer to our primary church account using these banking credentials.
              </p>

              <div className={styles.detailsList}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Bank Name</span>
                  <span className={styles.detailValue}>Co-operative Bank</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Account Name</span>
                  <span className={styles.detailValue}>PEFA CHURCH Kawangware 56</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Account Number</span>
                  <span className={styles.detailValue}>01128514279100</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Branch Code</span>
                  <span className={styles.detailValue}>46 Kawangware</span>
                </div>
              </div>

              <div className={styles.securityNotice}>
                <ShieldCheck size={16} />
                <span>Verified Official Church Account</span>
              </div>
            </div>
            
            {/* In-Person Giving */}
            <div className={styles.giveCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.person}`}>
                  <Heart size={24} />
                </div>
                <h3>In-Person Giving</h3>
              </div>

              <p className={styles.cardDesc}>
                Participate in giving during any scheduled worship service or visit our administrative offices during operating hours.
              </p>

              <div className={styles.infoBox}>
                <p>
                  Offering envelopes are supplied during services for cash or cheque donations.
                </p>
                <div className={styles.scheduleTip}>
                  <strong>Office Hours:</strong> Mon - Fri, 8:00 AM - 5:00 PM
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Thank You Callout Banner */}
        <section className={styles.thankYou}>
          <div className={styles.thankYouCard}>
            <div className={styles.thankYouIcon}>
              <Send size={28} />
            </div>
            <h2>Thank You for Your Support</h2>
            <p>
              Your contributions empower our ministry efforts across the community. If you need tax documentation or assistance, feel free to contact us.
            </p>
            <a href="/contact" className={styles.contactBtn}>
              Contact Finance Team
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Give;