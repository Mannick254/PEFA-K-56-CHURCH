import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Bell, Calendar, ChevronRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import styles from '../styles/WeeklyRhythms.module.css';

const weeklyPrograms = [
    { id: 1, day: "Mon", fullDay: "Monday", title: "Family Day", detail: "Men's Ministry Focus", time: "5:30 PM", color: "#3b82f6" },
    { id: 2, day: "Tue", fullDay: "Tuesday", title: "Prayer Meeting", detail: "Intercession & Power", time: "5:30 PM", color: "#f59e0b" },
    { id: 3, day: "Wed", fullDay: "Wednesday", title: "Women Ministry", detail: "Grace & Virtue Session", time: "5:30 PM", color: "#ec4899" },
    { id: 4, day: "Thu", fullDay: "Thursday", title: "Bible Study", detail: "Deep Word Foundation", time: "5:30 PM", color: "#10b981" },
    { id: 5, day: "Fri", fullDay: "Friday", title: "Fellowship", detail: "House Groups & Choir", time: "5:30 PM", color: "#8b5cf6" },
    { id: 6, day: "Sat", fullDay: "Saturday", title: "Praise & Worship Practice", detail: "Praise & Worship Team", time: "4:00 PM", color: "#6366f1" },
];

const WeeklyRhythms = () => {
    const dayOfWeek = new Date().getDay();
    const initialSelectedId = dayOfWeek === 0 ? 1 : dayOfWeek;
    const [selectedId, setSelectedId] = useState(initialSelectedId);
    const [isScheduleVisible, setIsScheduleVisible] = useState(false);
    const [reminders, setReminders] = useState({});

    const activeProg = weeklyPrograms.find(p => p.id === selectedId);
    const isToday = activeProg && activeProg.id === dayOfWeek;

    const handleSetReminder = (program) => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notifications.');
            return;
        }

        const showNotification = () => {
            new Notification(`Reminder: ${program.title}`, {
                body: `${program.detail} is starting now at ${program.time}.`,
                icon: '/k56_logo_outline.png',
            });
            setReminders(prev => ({ ...prev, [program.id]: false }));
        };

        const scheduleNotification = () => {
            const now = new Date();
            const dayMap = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 0 };
            const targetDay = dayMap[program.fullDay];
            const currentDay = now.getDay();
            let daysUntil = (targetDay - currentDay + 7) % 7;

            const timeParts = program.time.match(/(\d+):(\d+) (AM|PM)/i);
            if (!timeParts) {
                alert('Could not parse the event time.');
                return;
            }

            let hours = parseInt(timeParts[1], 10);
            const minutes = parseInt(timeParts[2], 10);
            const isPM = timeParts[3].toUpperCase() === 'PM';

            if (isPM && hours < 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;

            const targetDate = new Date();
            targetDate.setDate(now.getDate() + daysUntil);
            targetDate.setHours(hours, minutes, 0, 0);

            if (daysUntil === 0 && targetDate.getTime() < now.getTime()) {
                targetDate.setDate(targetDate.getDate() + 7);
            }
            
            const delay = targetDate.getTime() - now.getTime();

            if (delay > 0) {
                setTimeout(showNotification, delay);
                setReminders(prev => ({ ...prev, [program.id]: true }));
                alert(`Success! Reminder is set for ${program.title} on ${program.fullDay} at ${program.time}. You'll get a notification if you keep this page open.`);
            } else {
                alert('Cannot set a reminder for an event in the past.');
            }
        };

        if (Notification.permission === 'granted') {
            scheduleNotification();
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    scheduleNotification();
                } else {
                    alert('Permission to show notifications was denied.');
                }
            });
        } else {
            alert('Notifications are blocked. Please enable them in your browser settings to set reminders.');
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.sectionTitle}>Weekly <span>Rhythms</span></h2>
                    <p className={styles.sectionSub}>Mid-week growth & fellowship</p>
                </div>
                <div className={styles.dashboardGrid}>
                    <motion.div layout className={styles.heroCard} style={{ '--accent': activeProg.color }}>
                        <div className={styles.heroOverlay} />
                        <div className={styles.heroTop}>
                            <motion.span key={`badge-${selectedId}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={styles.liveBadge}>
                                <Sparkles size={14} /> {isToday ? "Happening Today" : "Active Session"}
                            </motion.span>
                            <div className={styles.heroTime}>
                                <Clock size={16} /> {activeProg.time}
                            </div>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div key={selectedId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={styles.heroBody}>
                                <span className={styles.heroDay}>{activeProg.fullDay}</span>
                                <h3 className={styles.heroTitle}>{activeProg.title}</h3>
                                <p className={styles.heroDetail}>{activeProg.detail}</p>
                            </motion.div>
                        </AnimatePresence>
                        <button className={styles.actionBtn} onClick={() => handleSetReminder(activeProg)} disabled={reminders[activeProg.id]}>
                            <Bell size={18} /> {reminders[activeProg.id] ? 'Reminder Set' : 'Set Reminder'}
                        </button>
                    </motion.div>
                    <div className={styles.listContainer}>
                        <AnimatePresence>
                            {isScheduleVisible ? (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={styles.scheduleWrapper}>
                                    <div className={styles.listHeader}>
                                        <span>Full Schedule</span>
                                        <button onClick={() => setIsScheduleVisible(false)} className={styles.toggleButton}>
                                            <EyeOff size={16} /> Show Less
                                        </button>
                                    </div>
                                    <div className={styles.scrollList}>
                                        {weeklyPrograms.map((prog) => (
                                            <motion.div key={prog.id} onClick={() => setSelectedId(prog.id)} className={`${styles.listItem} ${selectedId === prog.id ? styles.listActive : ''}`} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <div className={styles.listDot} style={{ backgroundColor: prog.color }} />
                                                <div className={styles.listInfo}>
                                                    <span className={styles.listDay}>{prog.day}</span>
                                                    <span className={styles.listTitle}>{prog.title}</span>
                                                </div>
                                                <div className={styles.listTime}>
                                                    {prog.time.split(' ')[0]}
                                                    <ChevronRight size={14} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div className={styles.promoCard}>
                                    <h4>Unlock the Full Week</h4>
                                    <p>Discover all our mid-week fellowship and growth opportunities.</p>
                                    <button onClick={() => setIsScheduleVisible(true)} className={styles.ctaButton}>
                                        <Eye size={16} /> See Full Weekly Schedule
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WeeklyRhythms;
