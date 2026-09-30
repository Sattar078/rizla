import { Link, NavLink, Outlet } from 'react-router-dom';

const links = [['Overview', '/admin'], ['Products', '/admin/products'], ['Categories', '/admin/categories'], ['Orders', '/admin/orders'], ['Receipts', '/admin/receipts'], ['Customers', '/admin/users']];

const AdminLayout = () => <div className="min-h-[calc(100vh-5rem)] bg-[#f4f5f1]"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-10"><aside><Link to="/admin" className="mb-5 block font-display text-xl font-semibold text-primary-900">Store management</Link><nav className="admin-nav gap-2 overflow-x-auto pb-2 lg:flex-col" aria-label="Admin navigation">{links.map(([label, to]) => <NavLink key={to} to={to} end={to === '/admin'} className={({ isActive }) => `shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-primary-900 text-white' : 'text-gray-600 hover:bg-white hover:text-primary-900'}`}>{label}</NavLink>)}</nav></aside><main className="min-w-0"><Outlet /></main></div></div>;

export default AdminLayout;