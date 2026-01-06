import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-container">
          <div className="header-logo">
            <img src="/Logo.svg" alt="لوگو جیب تو" />
          </div>
          <nav className="header-nav">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              داشبورد
            </NavLink>
            <NavLink
              to="/expenses"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              لیست هزینه‌ها
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
