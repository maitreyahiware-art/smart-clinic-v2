import React from 'react';
import { Bell, Search, Moon, Sun } from 'lucide-react';
import styles from './Layout.module.css';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className={styles.header}>
            <div className={styles.searchBar}>
                <Search size={18} color="var(--color-brand-secondary)" />
                <input type="text" placeholder="Search patients, meds, protocols..." style={{ color: 'var(--color-brand-secondary)', background: 'transparent' }} />
            </div>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>EPPD</span>
                    <span className={styles.statValue} style={{ color: 'var(--color-brand-secondary)' }}>18<span className={styles.statTrend} style={{ color: '#00B6C1' }}>↑</span></span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Avg Time</span>
                    <span className={styles.statValue} style={{ color: 'var(--color-brand-secondary)' }}>12m</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    onClick={toggleTheme}
                    className={styles.iconBtn}
                    style={{ color: 'var(--color-brand-secondary)' }}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button className={styles.iconBtn} style={{ color: 'var(--color-brand-secondary)' }}>
                    <Bell size={20} />
                    <span className={styles.notificationDot} />
                </button>
            </div>
        </header>
    );
}
