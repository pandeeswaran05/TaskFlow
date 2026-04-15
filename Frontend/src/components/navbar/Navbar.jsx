import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../Context/Authcontext';
import { useToast } from '../../Context/ToastContext';
import { ini } from '../../utils/Helper';

const Navbar = ({onOpenProfile, onOpenSettings }) => {
  const { user, logout } = useAuth();
  const { authToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const pillRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (pillRef.current && !pillRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    authToast('Signed out. See you soon! 👋');
  };

  const handleProfile = () => {
    setMenuOpen(false);
    onOpenProfile();
  };

  const handleSettings = () => {
    setMenuOpen(false);
    onOpenSettings();
  };

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">◆</div>
        Task Flow
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
       

        {user && (
          <div
            ref={pillRef}
            className={`user-pill${menuOpen ? ' open' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((p) => !p);
            }}
          >
            <div className="user-av">{ini(user.name)}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="user-nm">{user.name.split(' ')[0]}</span>
              <span className="user-role">My Account</span>
            </div>
            <span className="chevron">▾</span>

            <div className={`user-menu${menuOpen ? ' open' : ''}`}>
              <div className="um-head">
                <div className="um-av-big">{ini(user.name)}</div>
                <div className="um-name">{user.name}</div>
                <div className="um-email">{user.email}</div>
              </div>
               
              <div className="um-item" onClick={handleProfile}>
                <span
                  className="um-icon"
                  style={{ background: '#EEEDFE', fontSize: 14 }}
                >
                  👤
                </span>
                My Profile
              </div>
              <div className="um-item" onClick={handleSettings}>
                <span
                  className="um-icon"
                  style={{ background: '#E6F1FB', fontSize: 14 }}
                >
                  ⚙
                </span>
                Settings
              </div>
              <div className="um-divider" />
              <div className="um-item danger" onClick={handleLogout}>
                <span className="um-icon">🚪</span>
                Sign Out
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
