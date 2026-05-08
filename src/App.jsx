import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Enhance from '@/pages/Enhance';
import History from '@/pages/History';
import Pricing from '@/pages/Pricing';
import Admin from '@/pages/Admin';
import PageNotFound from '@/lib/PageNotFound';

export default function App() {
    return (
        <Routes>
            {/* Home has its own layout (landing page) */}
            <Route path="/" element={<Navigate to="/Home" replace />} />
            <Route path="/Home" element={<Home />} />

            {/* App pages with sidebar layout */}
            <Route element={<Layout />}>
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Enhance" element={<Enhance />} />
                <Route path="/History" element={<History />} />
                <Route path="/Pricing" element={<Pricing />} />
                <Route path="/Admin" element={<Admin />} />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}
