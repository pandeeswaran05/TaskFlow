import React, { useState } from 'react';
import { useAuth } from '../Context/Authcontext';
import { useToast } from '../Context/ToastContext';
import { pwStrength } from '../utils/Helper';

const Auth = () => {
  const { login, demoLogin, signup } = useAuth();
  const { authToast } = useToast();

  const [tab, setTab] = useState('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginRemember, setLoginRemember] = useState(false);
  const [loginErr, setLoginErr] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [sfn, setSfn] = useState('');
  const [sln, setSln] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sPass, setSPass] = useState('');
  const [sPass2, setSPass2] = useState('');
  const [signupErr, setSignupErr] = useState('');
  const [signupOk, setSignupOk] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const pw = pwStrength(sPass);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginErr('');
    setLoginLoading(true);
    try {
      const user = await login(
        loginEmail.trim().toLowerCase(),
        loginPass,
        loginRemember
      );
      authToast(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
    } catch (err) {
      const msg =
        err.response?.data?.error || 'Invalid email or password';
      setLoginErr(`❌ ${msg}. Try Demo Login to explore!`);
      setLoginPass('');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleDemoLogin = () => {
    demoLogin();
    authToast('Demo mode — explore freely! 🚀');
  };

  const handleForgot = () => {
    if (!loginEmail.trim()) {
      setLoginErr('ℹ️ Enter your email address first');
      return;
    }
    setLoginErr(
      'ℹ️ Password reset: Contact your administrator or use the email you signed up with.'
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupErr('');
    setSignupOk('');
    if (!sfn.trim()) {
      setSignupErr('❌ First name is required');
      return;
    }
    if (sPass.length < 6) {
      setSignupErr('❌ Password must be at least 6 characters');
      return;
    }
    if (sPass !== sPass2) {
      setSignupErr('❌ Passwords do not match!');
      return;
    }
    setSignupLoading(true);
    try {
      await signup({
        firstName: sfn,
        lastName: sln,
        email: sEmail,
        phone: sPhone,
        password: sPass,
      });
      setSignupOk('✓ Account created successfully! You can now sign in.');
      setTimeout(() => {
        setTab('login');
        setLoginEmail(sEmail);
        setSignupOk('');
        setSfn('');
        setSln('');
        setSEmail('');
        setSPhone('');
        setSPass('');
        setSPass2('');
      }, 1600);
    } catch (err) {
      setSignupErr(
        `❌ ${err.response?.data?.error || 'Signup failed. Please try again.'}`
      );
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-top">
          <div className="auth-logo">◆</div>
          <div className="auth-site-name">Task Flow</div>
          <div className="auth-tagline">Your smart management platform</div>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === 'login' ? ' active' : ''}`}
            onClick={() => setTab('login')}
          >
            🔒 Sign In
          </button>
          <button
            className={`auth-tab${tab === 'signup' ? ' active' : ''}`}
            onClick={() => setTab('signup')}
          >
            ✏️ Sign Up
          </button>
        </div>

        <div className="auth-body">
          {/* ── LOGIN FORM ── */}
          <form
            className={`auth-form${tab === 'login' ? ' active' : ''}`}
            onSubmit={handleLogin}
          >
            {loginErr && (
              <div
                className="a-err show"
                dangerouslySetInnerHTML={{ __html: loginErr }}
              />
            )}
            <div className="a-field">
              <label className="a-label">Email Address</label>
              <input
                className="a-input"
                type="email"
                placeholder="you@example.com"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="a-field">
              <label className="a-label">Password</label>
              <input
                className="a-input"
                type="password"
                placeholder="Enter your password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  fontSize: 12,
                  color: '#6B6A64',
                }}
              >
                <input
                  type="checkbox"
                  checked={loginRemember}
                  onChange={(e) => setLoginRemember(e.target.checked)}
                  style={{ accentColor: '#1D9E75' }}
                />
                Remember me
              </label>
              <span
                className="a-link"
                onClick={handleForgot}
                style={{ fontSize: 12 }}
              >
                Forgot password?
              </span>
            </div>
            <button type="submit" className="a-btn" disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In →'}
            </button>
            <div className="a-divider">or</div>
            <div className="a-social">
              <button
                type="button"
                className="a-social-btn"
                onClick={handleDemoLogin}
              >
                👤 Demo Login
              </button>
              <button
                type="button"
                className="a-social-btn"
                onClick={() => setTab('signup')}
              >
                ✏️ Register
              </button>
            </div>
          </form>

          {/* ── SIGNUP FORM ── */}
          <form
            className={`auth-form${tab === 'signup' ? ' active' : ''}`}
            onSubmit={handleSignup}
          >
            {signupErr && <div className="a-err show">{signupErr}</div>}
            {signupOk && <div className="a-succ show">{signupOk}</div>}
            <div className="a-row">
              <div className="a-field">
                <label className="a-label">First Name</label>
                <input
                  className="a-input"
                  placeholder="Raj"
                  required
                  value={sfn}
                  onChange={(e) => setSfn(e.target.value)}
                />
              </div>
              <div className="a-field">
                <label className="a-label">Last Name</label>
                <input
                  className="a-input"
                  placeholder="Kumar"
                  value={sln}
                  onChange={(e) => setSln(e.target.value)}
                />
              </div>
            </div>
            <div className="a-field">
              <label className="a-label">Email Address</label>
              <input
                className="a-input"
                type="email"
                placeholder="you@example.com"
                required
                value={sEmail}
                onChange={(e) => setSEmail(e.target.value)}
              />
            </div>
            <div className="a-field">
              <label className="a-label">Phone Number</label>
              <input
                className="a-input"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={sPhone}
                onChange={(e) => setSPhone(e.target.value)}
              />
            </div>
            <div className="a-field">
              <label className="a-label">Password</label>
              <div className="pw-toggle">
                <input
                  className="a-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  required
                  value={sPass}
                  onChange={(e) => setSPass(e.target.value)}
                />
                <button
                  type="button"
                  className="pw-eye"
                  onClick={() => setShowPass((p) => !p)}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
              {sPass && (
                <>
                  <div
                    className="pw-bar"
                    style={{ background: pw.color, width: pw.width }}
                  />
                  <div className="pw-lbl">{pw.label}</div>
                </>
              )}
            </div>
            <div className="a-field">
              <label className="a-label">Confirm Password</label>
              <div className="pw-toggle">
                <input
                  className="a-input"
                  type={showPass2 ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  required
                  value={sPass2}
                  onChange={(e) => setSPass2(e.target.value)}
                />
                <button
                  type="button"
                  className="pw-eye"
                  onClick={() => setShowPass2((p) => !p)}
                >
                  {showPass2 ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 7,
                cursor: 'pointer',
                fontSize: 12,
                color: '#6B6A64',
                lineHeight: 1.5,
              }}
            >
              <input
                type="checkbox"
                required
                style={{ accentColor: '#1D9E75', marginTop: 2 }}
              />
              I agree to the{' '}
              <span className="a-link">Terms &amp; Privacy Policy</span>
            </label>
            <button
              type="submit"
              className="a-btn"
              disabled={signupLoading}
            >
              {signupLoading ? 'Creating account...' : 'Create Account →'}
            </button>
            <p className="a-footer-txt">
              Already have an account?{' '}
              <span className="a-link" onClick={() => setTab('login')}>
                Sign in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;