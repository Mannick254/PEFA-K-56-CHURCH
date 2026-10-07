import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Bell, Check, Sparkles } from 'lucide-react';
import styles from '../styles/WeeklyRhythms.module.css';

const weeklyPrograms = [
  { id: 1, day: "Mon", fullDay: "Monday", title: "Family Day", detail: "Men's Ministry Focus", time: "5:30 PM", color: "#3b82f6" },
  { id: 2, day: "Tue", fullDay: "Tuesday", title: "Prayer Meeting", detail: "Intercession & Power", time: "5:30 PM", color: "#f59e0b" },
  { id: 3, day: "Wed", fullDay: "Wednesday", title: "Women Ministry", detail: "Grace & Virtue Session", time: "5:30 PM", color: "#ec4899" },
  { id: 4, day: "Thu", fullDay: "Thursday", title: "Bible Study", detail: "Deep Word Foundation", time: "5:30 PM", color: "#10b981" },
  { id: 5, day: "Fri", fullDay: "Friday", title: "Fellowship", detail: "House Groups & Choir", time: "5:30 PM", color: "#8b5cf6" },
  { id: 6, day: "Sat", fullDay: "Saturday", title: "Praise & Worship", detail: "Praise & Worship Team", time: "4:00 PM", color: "#6366f1" },
];

const WeeklyRhythms = () => {
  const currentDayIndex = new Date().getDay();
  const initialSelectedId = currentDayIndex === 0 ? 1 : currentDayIndex;

  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [reminders, setReminders] = useState({});
  const [isPaused, setIsPaused] = useState(false);

  const activeProg = weeklyPrograms.find(p => p.id === selectedId) || weeklyPrograms[0];
  const isToday = activeProg.id === currentDayIndex;

  // Auto-rotate through rhythms every 3.5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSelectedId((prevId) => {
        const currentIndex = weeklyPrograms.findIndex((p) => p.id === prevId);
        const nextIndex = (currentIndex + 1) % weeklyPrograms.length;
        return weeklyPrograms[nextIndex].id;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleSetReminder = useCallback((program) => {
    if (!('Notification' in window)) {
      alert('Desktop notifications are not supported in this browser.');
      return;
    }

    const scheduleNotification = () => {
      const now = new Date();
      const dayMap = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 0 };
      const targetDay = dayMap[program.fullDay];
      const currentDay = now.getDay();
      let daysUntil = (targetDay - currentDay + 7) % 7;

      const timeParts = program.time.match(/(\d+):(\d+) (AM|PM)/i);
      if (!timeParts) return;

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
        setTimeout(() => {
          new Notification(`Reminder: ${program.title}`, {
            body: `${program.detail} starts now at ${program.time}.`,
            icon: '/k56_logo_outline.png',
          });
          setReminders(prev => ({ ...prev, [program.id]: false }));
        }, delay);

        setReminders(prev => ({ ...prev, [program.id]: true }));
      }
    };

    if (Notification.permission === 'granted') {
      scheduleNotification();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') scheduleNotification();
      });
    }
  }, []);

  return (
    <section className={styles.containerSection}>
      <div 
        className={styles.barContainer}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Compact Day Navigation Pills */}
        <nav className={styles.dayStrip}>
          {weeklyPrograms.map((prog) => {
            const isSelected = selectedId === prog.id;
            const isProgToday = prog.id === currentDayIndex;

            return (
              <button
                key={prog.id}
                onClick={() => setSelectedId(prog.id)}
                className={`${styles.dayPill} ${isSelected ? styles.dayPillActive : ''}`}
                style={{ '--accent': prog.color }}
              >
                {isSelected && (
                  <motion.div
                    layoutId="pillGlow"
                    className={styles.pillActiveBg}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={styles.dayText}>{prog.day}</span>
                {isProgToday && <span className={styles.todayIndicator} />}
              </button>
            );
          })}
        </nav>

        {/* Non-Boundary (Borderless) Auto-Rotating Card */}
        <div className={styles.borderlessCard} style={{ '--accent': activeProg.color }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={styles.cardInner}
            >
              <div className={styles.leftInfo}>
                <span className={styles.dayTag}>{activeProg.fullDay}</span>
                <span className={styles.dotDivider}>•</span>
                <h4 className={styles.programTitle}>{activeProg.title}</h4>
                <span className={styles.detailText}>{activeProg.detail}</span>
              </div>

              <div className={styles.rightActions}>
                {isToday && (
                  <span className={styles.todayBadge}>
                    <Sparkles size={11} /> Today
                  </span>
                )}
                <span className={styles.timeText}>
                  <Clock size={12} /> {activeProg.time}
                </span>

                <button
                  className={`${styles.iconBellBtn} ${reminders[activeProg.id] ? styles.bellActive : ''}`}
                  onClick={() => handleSetReminder(activeProg)}
                  disabled={reminders[activeProg.id]}
                  title={reminders[activeProg.id] ? "Reminder set" : "Set reminder"}
                >
                  {reminders[activeProg.id] ? <Check size={13} /> : <Bell size={13} />}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default WeeklyRhythms;