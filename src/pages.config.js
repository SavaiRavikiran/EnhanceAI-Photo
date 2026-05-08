import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Enhance from '@/pages/Enhance';
import History from '@/pages/History';
import Pricing from '@/pages/Pricing';
import Admin from '@/pages/Admin';

export const pagesConfig = [
    { name: 'Home', path: '/Home', component: Home, showInNav: false },
    { name: 'Dashboard', path: '/Dashboard', component: Dashboard, showInNav: true, icon: 'LayoutDashboard' },
    { name: 'Enhance', path: '/Enhance', component: Enhance, showInNav: true, icon: 'Sparkles' },
    { name: 'History', path: '/History', component: History, showInNav: true, icon: 'Clock' },
    { name: 'Pricing', path: '/Pricing', component: Pricing, showInNav: true, icon: 'CreditCard' },
    { name: 'Admin', path: '/Admin', component: Admin, showInNav: true, icon: 'Shield' },
];
