import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('shiftexa_token');
    if (!token) {
      // Auto demo user fallback for seamless experience
      setDemoSession();
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setOrganization(res.data.currentOrganization);
        setOrganizations(res.data.organizations || []);
        if (res.data.currentOrganization?._id) {
          localStorage.setItem('shiftexa_org_id', res.data.currentOrganization._id);
        }
      } else {
        setDemoSession();
      }
    } catch (err) {
      console.warn('Auth check fallback to demo session:', err.message);
      setDemoSession();
    } finally {
      setLoading(false);
    }
  };

  const setDemoSession = () => {
    const demoUser = { id: 'demo_user_1', name: 'ABC Sales Admin', email: 'demo@abcproperties.com' };
    const demoOrg = {
      _id: '66f912a7d41b8a2e104f9810',
      name: 'ABC Properties',
      slug: 'abc-properties',
      industry: 'Real Estate Sales',
      location: 'Hyderabad, India',
      phone: '+91 40 4892 1100'
    };
    setUser(demoUser);
    setOrganization(demoOrg);
    setOrganizations([demoOrg]);
    localStorage.setItem('shiftexa_org_id', demoOrg._id);
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('shiftexa_token', res.data.token);
        localStorage.setItem('shiftexa_org_id', res.data.organization.id);
        setUser(res.data.user);
        setOrganization(res.data.organization);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password, companyName) => {
    try {
      const res = await api.post('/auth/signup', { name, email, password, companyName });
      if (res.data.success) {
        localStorage.setItem('shiftexa_token', res.data.token);
        localStorage.setItem('shiftexa_org_id', res.data.organization.id);
        setUser(res.data.user);
        setOrganization(res.data.organization);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('shiftexa_token');
    localStorage.removeItem('shiftexa_org_id');
    setUser(null);
    setOrganization(null);
    setDemoSession();
  };

  return (
    <AuthContext.Provider value={{ user, organization, organizations, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
