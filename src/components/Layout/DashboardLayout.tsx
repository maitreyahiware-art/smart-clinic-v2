'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="layout-container">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <main className="main-content" style={{ marginLeft: collapsed ? '80px' : '250px', transition: 'margin-left 0.3s ease' }}>
                <Header />
                {children}
            </main>
        </div>
    );
}
