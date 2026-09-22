import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clapperboard, Home as HomeIcon, Video, ImagePlus, Images, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const navItems = [
    { path: '/home', label: 'Home', icon: HomeIcon },
    { path: '/text-to-video', label: 'Text to Video', icon: Video },
    { path: '/image-to-video', label: 'Image to Video', icon: Images },
    { path: '/text-to-image', label: 'Text to Image', icon: ImagePlus },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={styles.nav}
    >
      <Link to="/home" style={styles.logo}>
        <Clapperboard size={22} strokeWidth={1.8} />
        <span>AI Video Studio</span>
      </Link>

      <div style={styles.links}>
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              style={{
                ...styles.link,
                color: active ? '#ffffff' : '#9a9ab0',
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
              }}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <div style={styles.userSection}>
        <span style={styles.userName}>{user.name || user.email}</span>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleLogout}
          style={styles.logoutBtn}
        >
          <LogOut size={15} strokeWidth={1.8} />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 32px',
    background: 'rgba(13, 13, 20, 0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'white',
    fontWeight: 600,
    fontSize: '15px',
    textDecoration: 'none',
    letterSpacing: '-0.2px',
  },
  links: { display: 'flex', alignItems: 'center', gap: '4px' },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '13.5px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  userSection: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { color: '#71718a', fontSize: '13px' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    background: 'rgba(255,255,255,0.06)',
    color: '#e5e5f0',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
  },
};

export default Navbar;