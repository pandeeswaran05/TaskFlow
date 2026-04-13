import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/Authcontext';
import { useToast } from '../../Context/ToastContext';
import { ini } from '../../utils/Helper';
import { updateProfileAPI } from '../../utils/Api';

const Profile = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { authToast } = useToast();

  const [fn, setFn] = useState('');
  const [ln, setLn] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [uid, setUid] = useState('');
  const [joined, setJoined] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      const nameParts = (user.name || '').split(' ');
      setFn(nameParts[0] || '');
      setLn(nameParts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setUid(user.id || user._id || '');
      setJoined(user.createdAt || '—');
      setMsg({ text: '', type: '' });
    }
  }, [isOpen, user]);

  const handleSave = async () => {
    if (!fn.trim()) {
      setMsg({ text: 'First name is required', type: 'err' });
      return;
    }
    if (!email.trim()) {
      setMsg({ text: 'Email is required', type: 'err' });
      return;
    }
    if (user?.isDemo || user?.id === 'demo') {
      setMsg({ text: 'Demo users cannot edit profile', type: 'err' });
      return;
    }
    setLoading(true);
    try {
      const res = await updateProfileAPI({
        firstName: fn,
        lastName: ln,
        email,
        phone,
      });
      updateUser(res.data.user, res.data.token);
      setMsg({ text: '✓ Profile updated successfully!', type: 'ok' });
      authToast('Profile saved! ✓');
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({
        text: err.response?.data?.error || 'Failed to update profile',
        type: 'err',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const displayName = `${fn} ${ln}`.trim() || user?.name || '—';

  return (
    <div className="panel-overlay open" onClick={handleOverlayClick}>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">👤 My Profile</div>
          <button className="panel-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="panel-body">
          <div className="panel-avatar-row">
            <div className="panel-av" style={{ background: '#7F77DD' }}>
              {ini(displayName)}
            </div>
            <div className="panel-av-info">
              <div className="pav-name">{displayName}</div>
              <div className="pav-email">{email || '—'}</div>
              <div className="pav-since">Member since {joined}</div>
            </div>
          </div>

          {msg.text && (
            <div className={`panel-msg show ${msg.type}`}>{msg.text}</div>
          )}

          <div className="panel-section">
            <div className="panel-section-title">✎ Edit Profile Information</div>
            <div className="panel-row">
              <div className="panel-field">
                <label className="panel-label">First Name</label>
                <input
                  className="panel-input"
                  placeholder="First name"
                  value={fn}
                  onChange={(e) => setFn(e.target.value)}
                />
              </div>
              <div className="panel-field">
                <label className="panel-label">Last Name</label>
                <input
                  className="panel-input"
                  placeholder="Last name"
                  value={ln}
                  onChange={(e) => setLn(e.target.value)}
                />
              </div>
            </div>
            <div className="panel-field">
              <label className="panel-label">Email Address</label>
              <input
                className="panel-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="panel-field">
              <label className="panel-label">Phone Number</label>
              <input
                className="panel-input"
                placeholder="+91..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">🔒 Account Info (Read Only)</div>
            <div className="panel-field">
              <label className="panel-label">User ID</label>
              <input
                className="panel-input"
                readOnly
                value={uid}
                style={{ fontSize: 11 }}
              />
            </div>
            <div className="panel-field">
              <label className="panel-label">Joined On</label>
              <input className="panel-input" readOnly value={joined} />
            </div>
          </div>

          <button
            className="panel-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : '✓ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;