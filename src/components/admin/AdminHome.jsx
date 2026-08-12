import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/AdminHome.module.css';
import {
  FaUsers, FaUserGraduate, FaChild, FaCalendarCheck, FaUserPlus, FaHome, FaBook,
  FaCalendarAlt, FaPray, FaFileAlt, FaHandHoldingHeart, FaInfoCircle, FaLandmark,
  FaBible, FaChurch, FaDatabase,
  FaImage, FaVideo
} from 'react-icons/fa';

const navGroups = [
    {
        title: "Live Stream",
        icon: <FaVideo />,
        links: [
            { to: "/admin/live", label: "Live", icon: <FaVideo /> },
        ]
    },
    {
      title: "Internal Data",
      icon: <FaUsers />,
      links: [
        { to: "/admin/view-data", label: "All Data", icon: <FaDatabase /> },
        { to: "/admin/members", label: "Members", icon: <FaUsers /> },
        { to: "/admin/youth", label: "Youth", icon: <FaUserGraduate /> },
        { to: "/admin/children", label: "Children", icon: <FaChild /> },
        { to: "/admin/attendance", label: "Attendance", icon: <FaCalendarCheck /> },
        { to: "/admin/visitors", label: "Visitors", icon: <FaUserPlus /> },
        { to: "/admin/connect", label: "Connect", icon: <FaUserPlus /> },
      ]
    },
    {
      title: "Public Publishing",
      icon: <FaHome />,
      links: [
        { to: "/admin/home-page", label: "Home", icon: <FaHome /> },
        { to: "/admin/hero-admin", label: "Hero", icon: <FaHome /> },
        { to: "/admin/sermons", label: "Sermons", icon: <FaBook /> },
        { to: "/admin/blog", label: "Blog", icon: <FaBook /> },
        { to: "/admin/events", label: "Events", icon: <FaCalendarAlt /> },
        { to: "/admin/prayers", label: "Prayers", icon: <FaPray /> },
        { to: "/admin/statement-of-faith", label: "Faith", icon: <FaFileAlt /> },
        { to: "/admin/kindness-acts", label: "Kindness", icon: <FaHandHoldingHeart /> },
        { to: "/admin/k56-gallery", label: "Gallery", icon: <FaImage /> },
      ]
    },
    {
      title: "Content Pages",
      icon: <FaInfoCircle />,
      links: [
        { to: "/admin/about-page", label: "About", icon: <FaInfoCircle /> },
        { to: "/admin/church-importance", label: "Landmark", icon: <FaLandmark /> },
        { to: "/admin/jesus-lessons", label: "Lessons", icon: <FaBible /> },
        { to: "/admin/church-established", label: "Foundation", icon: <FaChurch /> },
      ]
    },
    {
      title: "Church Department",
      icon: <FaChurch />,
      links: [
        { to: "/admin/church-department", label: "Department", icon: <FaChurch /> },
      ]
    }
  ];

const AdminHome = () => {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.groupsGrid}>
        {navGroups.map((group, index) => (
          <div key={index} className={styles.groupCard}>
            <h2 className={styles.groupTitle}>
              {group.icon}
              {group.title}
            </h2>
            <div className={styles.linksContainer}>
              {group.links.map((link, linkIndex) => (
                <Link key={linkIndex} to={link.to} className={styles.linkCard}>
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
