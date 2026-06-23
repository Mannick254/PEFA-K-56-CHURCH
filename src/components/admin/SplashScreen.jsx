import React, { useEffect, useState } from 'react';
import styles from '../../styles/SplashScreen.module.css';

const SplashScreen = () => {
    const [fireworks, setFireworks] = useState([]);

    useEffect(() => {
        // Generate a burst of fireworks on component mount
        const newFireworks = Array.from({ length: 20 }).map((_, index) => ({
            id: index,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${1 + Math.random()}s`,
            animationDelay: `${Math.random() * 1.5}s`,
            '--random-x': Math.random(),
            '--random-y': Math.random(),
        }));
        setFireworks(newFireworks);
    }, []);

    return (
        <div className={styles.splashScreen}>
            <div className={styles.fireworks}>
                {fireworks.map(fw => (
                    <div
                        key={fw.id}
                        className={styles.firework}
                        style={{
                            left: fw.left,
                            top: fw.top,
                            animationDuration: fw.animationDuration,
                            animationDelay: fw.animationDelay,
                            '--random-x': fw['--random-x'],
                            '--random-y': fw['--random-y'],
                        }}
                    />
                ))}
            </div>
            <div className={styles.splashContent}>
                <h1 className={styles.splashName}>PEFAK56</h1>
            </div>
        </div>
    );
};

export default SplashScreen;