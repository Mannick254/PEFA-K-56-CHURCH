import React from 'react';
import styles from '../../styles/IctServices.module.css';
import { Link } from 'react-router-dom';
import { Code, Server, Database, ShieldCheck, BarChart, Users } from 'lucide-react';
import IctNavbar from '../../components/IctNavbar';
import IctFooter from '../../components/IctFooter';

const services = [
  {
    icon: <Code size={40} />,
    title: 'Web Development',
    description: 'We build modern, responsive, and secure websites and web applications tailored to your needs.',
  },
  {
    icon: <Server size={40} />,
    title: 'Systems Management',
    description: 'We ensure your digital infrastructure is reliable, scalable, and efficient.',
  },
  {
    icon: <Database size={40} />,
    title: 'Database Management',
    description: 'We design and maintain robust database systems to keep your data organized and accessible.',
  },
  {
    icon: <ShieldCheck size={40} />,
    title: 'Cybersecurity',
    description: 'We protect your digital assets with cutting-edge security measures and best practices.',
  },
  {
    icon: <BarChart size={40} />,
    title: 'Data Analytics',
    description: 'We help you make data-driven decisions by providing insightful analytics and visualizations.',
  },
  {
    icon: <Users size={40} />,
    title: 'Community Building',
    description: 'We foster a collaborative environment for learning, growth, and innovation.',
  },
];

const IctServices = () => {
  return (
    <div className={styles.pageWrapper}>
      <IctNavbar />
      <main className={styles.mainContent}>
        {/* Hero Section */}
        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Our Expertise</span>
            <h1 className={styles.heroTitle}>Our Services</h1>
            <p className={styles.heroSubtext}>
              Providing a wide range of technology services to empower our church and community.
            </p>
            <div className={styles.ctaGroup}>
              <Link to="/ict-team/Contact" className={styles.primaryBtn}>Request a Service</Link>
            </div>
          </div>
        </header>

        {/* Services Section */}
        <section className={styles.servicesSection}>
          <div className={styles.container}>
            <div className={styles.grid}>
              {services.map((service, index) => (
                <div key={index} className={styles.serviceCard}>
                  <div className={styles.serviceIcon}>{service.icon}</div>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDescription}>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <IctFooter />
    </div>
  );
};

export default IctServices;
