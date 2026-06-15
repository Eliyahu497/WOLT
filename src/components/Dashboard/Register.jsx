import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

export const Register = ({ onToggleView, onBackToGuest }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    lat: '',
    lng: '',
    userName: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // 'customer' or 'manager'
    avatar: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, lat, lng, userName, password, confirmPassword, role, avatar } = formData;

    if (!name.trim() || !email.trim() || !phone.trim() || !lat || !lng || !userName.trim() || !password.trim() || !confirmPassword.trim() || !avatar.trim()) {
      setError('All fields are required');
      return;
    }
    
    if (isNaN(Number(lat)) || isNaN(Number(lng))) {
      setError('Latitude and Longitude must be valid numbers');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
      { lat: Number(lat), lng: Number(lng) },
      userName.trim(),
      password.trim(),
      role,
      avatar.trim()
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
                  <span className="role-card-title">Customer</span>
                  <span className="role-card-desc">regular account</span>
                </div>
              </div>

              <div
                className={`role-card ${formData.role === 'manager' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('manager')}
              >
                <div className="role-card-icon">🏪</div>
                <div className="role-card-content">
                  <span className="role-card-title">Restaurant Manager</span>
                  <span className="role-card-desc">Boss account</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name <span style={{ color: '#eb5757' }}>*</span></label>
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
              <label htmlFor="email">Email Address <span style={{ color: '#eb5757' }}>*</span></label>
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
              <label htmlFor="phone">Phone Number <span style={{ color: '#eb5757' }}>*</span></label>
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
              <label htmlFor="userName">Username <span style={{ color: '#eb5757' }}>*</span></label>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lat">Latitude <span style={{ color: '#eb5757' }}>*</span></label>
              <input
                type="number"
                step="any"
                id="lat"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                placeholder="e.g. 32.0853"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lng">Longitude <span style={{ color: '#eb5757' }}>*</span></label>
              <input
                type="number"
                step="any"
                id="lng"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                placeholder="e.g. 34.7818"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group avatar-form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Profile Image <span style={{ color: '#eb5757' }}>*</span></label>
            <div className="avatar-uploader-container">
              <label htmlFor="avatar" className="avatar-uploader-label" style={{ display: 'block', cursor: 'pointer' }}>
                {formData.avatar ? (
                  <div className="avatar-preview-wrapper">
                    <img src={formData.avatar} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="avatar-hover-overlay">
                      <span className="camera-icon">📷</span>
                    </div>
                  </div>
                ) : (
                  <div className="avatar-placeholder">
                    <span className="camera-icon">📷</span>
                    <span className="avatar-placeholder-text">Add Photo</span>
                  </div>
                )}
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isSubmitting}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span style={{ color: '#eb5757' }}>*</span></label>
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password <span style={{ color: '#eb5757' }}>*</span></label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <div>
            <span>Already have an account? </span>
            <button onClick={onToggleView} className="auth-toggle-btn">
              Log In
            </button>
          </div>
          {onBackToGuest && (
            <button onClick={onBackToGuest} className="auth-toggle-btn" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              ← Back to Browsing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
