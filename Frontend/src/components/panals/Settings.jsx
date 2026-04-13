import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/Authcontext';
import { useToast } from '../../Context/ToastContext';
import { ini, pwStrength } from '../../utils/Helper';
import { changePasswordAPI, deleteAccountAPI } from '../../utils/Api';

const Settings = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { authToast } = useToast();

  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOldPw('');
      setNewPw('');
      setConfirmPw('');
      setMsg({ text: '', type: '' });
      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [isOpen]);

  const pw = pwStrength(newPw);

  const handleChangePassword = async () => {
    setMsg({ text: '', type: '' });
    if (user?.isDemo || user?.id === 'demo') {
      setMsg({ text: 'Demo users cannot change password', type: 'err' });
      return;
    }
    if (!oldPw || !newPw || !confirmPw) {
      setMsg({ text: 'All password fields are required', type: 'err' });
      return;
    }
    if (newPw.length < 6) {
      setMsg({
        text: 'New password must be at least 6 characters',
        type: 'err',
      });
      return;
    }
    if (newPw !== confirmPw) {
      setMsg({ text: 'New passwords do not match!', type: 'err' });
      return;
    }
    setLoading(true);
    try {
      await changePasswordAPI({
        oldPassword: oldPw,
        newPassword: newPw,
        confirmPassword: confirmPw,
      });
      setOldPw('');
      setNewPw('');
      setConfirmPw('');
      setMsg({ text: '✓ Password changed successfully!', type: 'ok' });
      authToast('Password updated! 🔐');
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({
        text: err.response?.data?.error || 'Failed to change password',
        type: 'err',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (user?.isDemo || user?.id === 'demo') {
      authToast('Demo accounts cannot be deleted');
      return;
    }
    if (
      !window.confirm(
        'Are you sure? This will permanently delete your account and ALL student data. This cannot be undone.'
      )
    )
      return;
    try {
      await deleteAccountAPI();
      onClose();
      logout();
      authToast('Account deleted. Goodbye!');
    } catch (err) {
      authToast(err.response?.data?.error || 'Failed to delete account');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="panel-overlay open" onClick={handleOverlayClick}>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">⚙ Account Settings</div>
          <button className="panel-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="panel-body">
          <div className="panel-avatar-row">
            <div className="panel-av" style={{ background: '#7F77DD' }}>
              {ini(user?.name || '?')}
            </div>
            <div className="panel-av-info">
              <div className="pav-name">{user?.name || '—'}</div>
              <div className="pav-email">{user?.email || '—'}</div>
              <div className="pav-since">
                Member since {user?.createdAt || '—'}
              </div>
            </div>
          </div>

          {msg.text && (
            <div className={`panel-msg show ${msg.type}`}>{msg.text}</div>
          )}

          <div className="panel-section">
            <div className="panel-section-title">🔑 Change Password</div>

            <div className="panel-field">
              <label className="panel-label">Current Password</label>
              <div className="pw-toggle" style={{ position: 'relative' }}>
                <input
                  className="panel-input"
                  type={showOld ? 'text' : 'password'}
                  placeholder="Enter current password"
                  style={{ paddingRight: 42 }}
                  value={oldPw}
                  onChange={(e) => setOldPw(e.target.value)}
                />
                <button
                  type="button"
                  className="pw-eye"
                  onClick={() => setShowOld((p) => !p)}
                >
                  {showOld ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div className="panel-field">
              <label className="panel-label">New Password</label>
              <div className="pw-toggle" style={{ position: 'relative' }}>
                <input
                  className="panel-input"
                  type={showNew ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  style={{ paddingRight: 42 }}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
                <button
                  type="button"
                  className="pw-eye"
                  onClick={() => setShowNew((p) => !p)}
                >
                  {showNew ? '🙈' : '👁'}
                </button>
              </div>
              {newPw && (
                <>
                  <div
                    className="pw-bar"
                    style={{ background: pw.color, width: pw.width }}
                  />
                  <div className="pw-lbl">{pw.label}</div>
                </>
              )}
            </div>

            <div className="panel-field">
              <label className="panel-label">Confirm New Password</label>
              <div className="pw-toggle" style={{ position: 'relative' }}>
                <input
                  className="panel-input"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  style={{ paddingRight: 42 }}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                />
                <button
                  type="button"
                  className="pw-eye"
                  onClick={() => setShowConfirm((p) => !p)}
                >
                  {showConfirm ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              className="panel-btn"
              onClick={handleChangePassword}
              disabled={loading}
              style={{ marginBottom: 12 }}
            >
              {loading ? 'Updating...' : '🔑 Update Password'}
            </button>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">🚫 Danger Zone</div>
            <button
              className="panel-btn panel-btn-danger"
              onClick={handleDeleteAccount}
            >
              🗑 Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;