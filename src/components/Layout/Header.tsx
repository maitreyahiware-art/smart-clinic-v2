import React from 'react';
import { Bell, Search } from 'lucide-react';
import styles from './Layout.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.searchBar}>
                <Search size={18} color="#0E5858" />
                <input type="text" placeholder="Search patients, meds, protocols..." />
            </div>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>EPPD</span>
                    <span className={styles.statValue}>18<span className={styles.statTrend}>↑</span></span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Avg Time</span>
                    <span className={styles.statValue}>12m</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.iconBtn}>
                    <Bell size={20} />
                    <span className={styles.notificationDot} />
                </button>
            </div>
        </header>
    );
}
