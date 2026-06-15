import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

export const Register = ({ onToggleView }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    userName: '',
    password: '',
    role: 'customer' // 'customer' or 'manager'
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, address, userName, password, role } = formData;

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !userName.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      setError('Phone number must be exactly 10 digits (e.g., 0541234567)');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const result = await register(
      name.trim(),
      email.trim(),
      phone.trim(),
      address.trim(),
      userName.trim(),
      password.trim(),
      role
    );

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Registration failed. Username might be taken.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <span className="auth-logo">Wolt</span>
          <span className="auth-badge">Clone</span>
          <h2 className="auth-title">Create an Account</h2>
          <p className="auth-subtitle">Join us to discover delicious meals or manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error-message">{error}</div>}

          {/* Role Selection Segmented Cards */}
          <div className="role-selection-group">
            <span className="role-label">I want to:</span>
            <div className="role-cards-container">
              <div 
                className={`role-card ${formData.role === 'customer' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('customer')}
              >
                <div className="role-card-icon">🍔</div>
                <div className="role-card-content">
                  <span className="role-card-title">Order Food</span>
                  <span className="role-card-desc">Browse & order from local kitchens</span>
                </div>
              </div>

              <div 
                className={`role-card ${formData.role === 'manager' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('manager')}
              >
                <div className="role-card-icon">🏪</div>
                <div className="role-card-content">
                  <span className="role-card-title">Manage Shop</span>
                  <span className="role-card-desc">Run & edit restaurants & menus</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0541234567"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="john_doe"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Physical Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Dizengoff 100, Tel Aviv"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <button onClick={onToggleView} className="auth-toggle-btn">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
