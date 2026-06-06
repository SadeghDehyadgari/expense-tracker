// CHANGED: Logout button now uses only icon, brand color and hover effect
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoutIcon from '../../assets/Outline/Logout.svg';
import './Layout.css';

const Layout = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          {/* UPDATED: Logout button with brand color and only icon */}
          {isAuthenticated && (
            <button className="logout-button" onClick={handleLogout} aria-label="خروج">
              <img src={logoutIcon} alt="خروج" />
            </button>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
