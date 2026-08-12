import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from '../../styles/AdminDrawer.module.css';

const Drawer = ({ isOpen, onClose, title, children }) => {

    const drawerVariants = {
        hidden: { x: '100%' },
        visible: { 
            x: 0, 
            transition: { 
                duration: 0.5, 
                ease: [0.25, 1, 0.5, 1] 
            }
        },
        exit: { 
            x: '100%', 
            transition: { 
                duration: 0.4, 
                ease: [0.5, -0.05, 1, 0.5] 
            }
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.4 } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        className={styles.backdrop}
                        onClick={onClose}
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    />
                    <motion.div 
                        className={styles.drawer}
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <header className={styles.drawerHeader}>
                            <h2>{title}</h2>
                            <button onClick={onClose} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </header>
                        <main className={styles.content}>
                            {children}
                        </main>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Drawer;
