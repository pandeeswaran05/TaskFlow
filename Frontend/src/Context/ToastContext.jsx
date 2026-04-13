import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [authToastMsg, setAuthToastMsg] = useState('');
  const [authToastVisible, setAuthToastVisible] = useState(false);
  const timerRef = useRef();
  const authTimerRef = useRef();

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToastVisible(false), 2200);
  }, []);

  const authToast = useCallback((msg) => {
    setAuthToastMsg(msg);
    setAuthToastVisible(true);
    clearTimeout(authTimerRef.current);
    authTimerRef.current = setTimeout(() => setAuthToastVisible(false), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, authToast }}>
      {children}
      <div className={`toast-bar${toastVisible ? ' show' : ''}`}>{toastMsg}</div>
      <div className={`auth-toast${authToastVisible ? ' show' : ''}`}>{authToastMsg}</div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);