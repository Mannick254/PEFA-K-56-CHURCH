// src/components/admin/AdminHome.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/AdminHome.module.css';
import WarningModal from './WarningModal';
import CreateAdmin from './CreateAdmin';
import AdminList from './AdminList';
import {
    FaUsers, FaUserGraduate, FaChild, FaCalendarCheck, FaUserPlus, FaHome, FaBook,
    FaCalendarAlt, FaPray, FaFileAlt, FaHandHoldingHeart, FaInfoCircle, FaLandmark,
    FaBible, FaChurch, FaDatabase, FaImage, FaVideo, FaUserShield, FaSearch, 
    FaChevronRight, FaChevronDown, FaTimes, FaLayerGroup
} from 'react-icons/fa';

const NAV_GROUPS = [
    {
        id: "live",
        title: "Live Stream",
        icon: <FaVideo />,
        description: "Broadcast & media management",
        links: [
            { to: "/admin/live", label: "Live Control", icon: <FaVideo />, badge: "Live" },
        ]
    },
    {
        id: "data",
        title: "Internal Data",
        icon: <FaUsers />,
        description: "Congregation records & registrations",
        links: [
            { to: "/admin/view-data", label: "All Data Explorer", icon: <FaDatabase /> },
            { to: "/admin/members", label: "Members", icon: <FaUsers /> },
            { to: "/admin/youth", label: "Youth Ministry", icon: <FaUserGraduate /> },
            { to: "/admin/children", label: "Children Ministry", icon: <FaChild /> },
            { to: "/admin/attendance", label: "Attendance Logs", icon: <FaCalendarCheck /> },
            { to: "/admin/visitors", label: "Visitor Directory", icon: <FaUserPlus /> },
            { to: "/admin/connect", label: "Connect Requests", icon: <FaUserPlus /> },
        ]
    },
    {
        id: "publishing",
        title: "Public Publishing",
        icon: <FaHome />,
        description: "Website landing pages & media content",
        links: [
            { to: "/admin/home-page", label: "Home Config", icon: <FaHome /> },
            { to: "/admin/hero-admin", label: "Hero Banners", icon: <FaHome /> },
            { to: "/admin/sermons", label: "Sermons Library", icon: <FaBook /> },
            { to: "/admin/blog", label: "Blog Posts", icon: <FaBook /> },
            { to: "/admin/events", label: "Church Events", icon: <FaCalendarAlt /> },
            { to: "/admin/prayers", label: "Prayer Requests", icon: <FaPray /> },
            { to: "/admin/statement-of-faith", label: "Faith Statement", icon: <FaFileAlt /> },
            { to: "/admin/kindness-acts", label: "Kindness Outreach", icon: <FaHandHoldingHeart /> },
            { to: "/admin/k56-gallery", label: "Media Gallery", icon: <FaImage /> },
        ]
    },
    {
        id: "content",
        title: "Content Pages",
        icon: <FaInfoCircle />,
        description: "Informational & doctrinal pages",
        links: [
            { to: "/admin/about-page", label: "About Us", icon: <FaInfoCircle /> },
            { to: "/admin/church-importance", label: "Landmarks", icon: <FaLandmark /> },
            { to: "/admin/jesus-lessons", label: "Lessons", icon: <FaBible /> },
            { to: "/admin/church-established", label: "Foundation", icon: <FaChurch /> },
        ]
    },
    {
        id: "department",
        title: "Church Departments",
        icon: <FaChurch />,
        description: "Departmental structures & roles",
        links: [
            { to: "/admin/church-department", label: "Department Hub", icon: <FaChurch /> },
        ]
    }
];

const AdminHome = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [expandedGroup, setExpandedGroup] = useState(null);

    useEffect(() => {
        const hasAcknowledged = localStorage.getItem('hasAcknowledgedAdminWarning');
        if (hasAcknowledged !== 'true') {
            setIsModalOpen(true);
        }
    }, []);

    const handleCloseModal = () => {
        localStorage.setItem('hasAcknowledgedAdminWarning', 'true');
        setIsModalOpen(false);
    };

    const toggleGroupAccordion = (groupId) => {
        setExpandedGroup(prev => prev === groupId ? null : groupId);
    };

    // Real-time filtering based on search input and active category chip
    const filteredGroups = useMemo(() => {
        return NAV_GROUPS.map(group => {
            if (activeCategory !== 'ALL' && group.id !== activeCategory) {
                return null;
            }

            if (!searchTerm.trim()) return group;

            const query = searchTerm.toLowerCase();
            const matchingLinks = group.links.filter(link =>
                link.label.toLowerCase().includes(query) ||
                link.to.toLowerCase().includes(query)
            );

            if (matchingLinks.length > 0 || group.title.toLowerCase().includes(query)) {
                return {
                    ...group,
                    links: matchingLinks.length > 0 ? matchingLinks : group.links
                };
            }
            return null;
        }).filter(Boolean);
    }, [searchTerm, activeCategory]);

    const totalToolsCount = useMemo(() => {
        return NAV_GROUPS.reduce((acc, g) => acc + g.links.length, 0);
    }, []);

    return (
        <div className={styles.homeContainer}>
            <WarningModal isOpen={isModalOpen} onClose={handleCloseModal} />

            {/* Header Area */}
            <header className={styles.dashboardHeader}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Control Center</h1>
                    <p className={styles.description}>
                        Centralized administration and publishing portal.
                    </p>
                </div>

                <div className={styles.metricsBar}>
                    <div className={styles.metricCard}>
                        <span className={styles.metricValue}>{NAV_GROUPS.length}</span>
                        <span className={styles.metricLabel}>Modules</span>
                    </div>
                    <div className={styles.metricCard}>
                        <span className={styles.metricValue}>{totalToolsCount}</span>
                        <span className={styles.metricLabel}>Tools</span>
                    </div>
                </div>
            </header>

            {/* Sticky Search & Touch Filter Chips */}
            <div className={styles.stickySearchArea}>
                <div className={styles.searchWrapper}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search tools or pages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchTerm && (
                        <button className={styles.clearSearchBtn} onClick={() => setSearchTerm('')}>
                            <FaTimes />
                        </button>
                    )}
                </div>

                <div className={styles.chipFilterScroll}>
                    <button 
                        className={activeCategory === 'ALL' ? styles.activeChip : styles.chip}
                        onClick={() => setActiveCategory('ALL')}
                    >
                        <FaLayerGroup /> All
                    </button>
                    {NAV_GROUPS.map(g => (
                        <button 
                            key={g.id} 
                            className={activeCategory === g.id ? styles.activeChip : styles.chip}
                            onClick={() => setActiveCategory(g.id)}
                        >
                            {g.icon} {g.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation Accordion Cards Grid */}
            <div className={styles.groupsGrid}>
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => {
                        const isExpanded = expandedGroup === group.id || searchTerm.length > 0 || activeCategory !== 'ALL';
                        return (
                            <div key={group.id} className={styles.groupCard}>
                                <div 
                                    className={styles.groupHeader} 
                                    onClick={() => toggleGroupAccordion(group.id)}
                                >
                                    <div className={styles.groupTitleWrapper}>
                                        <span className={styles.groupIcon}>{group.icon}</span>
                                        <div>
                                            <h2 className={styles.groupTitle}>{group.title}</h2>
                                            <p className={styles.groupSubtext}>{group.description}</p>
                                        </div>
                                    </div>
                                    <div className={styles.headerRight}>
                                        <span className={styles.badge}>{group.links.length}</span>
                                        <FaChevronDown className={`${styles.accordionIcon} ${isExpanded ? styles.open : ''}`} />
                                    </div>
                                </div>

                                <div className={`${styles.linksContainer} ${isExpanded ? styles.expanded : styles.collapsed}`}>
                                    {group.links.map((link, linkIndex) => (
                                        <Link key={linkIndex} to={link.to} className={styles.linkCard}>
                                            <div className={styles.linkMain}>
                                                <span className={styles.linkIcon}>{link.icon}</span>
                                                <span className={styles.linkLabel}>{link.label}</span>
                                            </div>
                                            <div className={styles.linkAction}>
                                                {link.badge && <span className={styles.liveTag}>{link.badge}</span>}
                                                <FaChevronRight className={styles.arrowIcon} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={styles.noResults}>
                        <p>No tools match "<strong>{searchTerm}</strong>"</p>
                        <button className={styles.resetBtn} onClick={() => { setSearchTerm(''); setActiveCategory('ALL'); }}>
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile-Friendly Admin Management Section */}
            <section className={styles.adminSection}>
                <div className={styles.sectionHeader}>
                    <FaUserShield className={styles.sectionIcon} />
                    <h2>System Access & Roles</h2>
                </div>
                <div className={styles.adminGrid}>
                    <CreateAdmin />
                    <AdminList />
                </div>
            </section>
        </div>
    );
};

export default AdminHome;