import React, { useState, useEffect } from 'react';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconShield,
  IconEye,
  IconEyeOff,
  IconCheckCircle,
  IconAlertTriangle,
  IconXCircle,
  IconSparkles,
  IconCheck
} from './Icons';

export default function CreateUserForm({ onUserCreated }) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Password rules checklist state
  const passwordRules = {
    minLength: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[^a-zA-Z0-9]/.test(formData.password)
  };

  const calculatePasswordStrength = () => {
    const passed = Object.values(passwordRules).filter(Boolean).length;
    if (passed <= 1) return { score: 20, label: 'Very Weak', color: '#ef4444' };
    if (passed === 2) return { score: 40, label: 'Weak', color: '#f97316' };
    if (passed === 3) return { score: 60, label: 'Fair', color: '#eab308' };
    if (passed === 4) return { score: 80, label: 'Good', color: '#3b82f6' };
    return { score: 100, label: 'Strong', color: '#10b981' };
  };

  const strength = calculatePasswordStrength();

  // Validate form fields
  const validate = (data = formData) => {
    const errs = {};

    if (!data.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    } else if (data.fullName.trim().length < 3) {
      errs.fullName = 'Full Name must contain at least 3 characters';
    }

    if (!data.username.trim()) {
      errs.username = 'Username is required';
    }

    if (!data.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errs.email = 'Invalid email format';
    }

    if (!data.phoneNumber.trim()) {
      errs.phoneNumber = 'Phone Number is required';
    } else if (!/^[0-9]+$/.test(data.phoneNumber.trim())) {
      errs.phoneNumber = 'Phone Number must contain only digits';
    }

    if (!data.password) {
      errs.password = 'Password is required';
    } else {
      const pRules = {
        minLength: data.password.length >= 8,
        hasUpper: /[A-Z]/.test(data.password),
        hasLower: /[a-z]/.test(data.password),
        hasNumber: /[0-9]/.test(data.password),
        hasSpecial: /[^a-zA-Z0-9]/.test(data.password)
      };
      if (!Object.values(pRules).every(Boolean)) {
        errs.password = 'Password must meet all complexity requirements';
      }
    }

    if (!data.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (data.confirmPassword !== data.password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    return errs;
  };

  useEffect(() => {
    const currentErrors = validate();
    setErrors(currentErrors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isFormValid = Object.keys(validate()).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentErrors = validate();
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      setTouched({
        fullName: true,
        username: true,
        email: true,
        phoneNumber: true,
        password: true,
        confirmPassword: true
      });
      return;
    }

    setSubmitting(true);
    setToast(null);

    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
          throw new Error('Please fix the validation errors in the form.');
        }
        throw new Error(data.message || 'Failed to create user. Please try again.');
      }

      setToast({
        type: 'success',
        message: `User '${data.username}' (${data.fullName}) created successfully as ${data.role}!`
      });

      // Reset form
      setFormData({
        fullName: '',
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
      });
      setTouched({});
      setErrors({});

      if (onUserCreated) {
        onUserCreated(data);
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IconSparkles className="w-6 h-6" style={{ color: '#818cf8' }} /> Create New User
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Add an enterprise user with secure credentials and access controls.
          </p>
        </div>
      </div>

      {toast && (
        <div className={`toast-alert ${toast.type}`}>
          {toast.type === 'success' ? (
            <IconCheckCircle className="w-6 h-6" style={{ color: '#34d399', flexShrink: 0 }} />
          ) : (
            <IconXCircle className="w-6 h-6" style={{ color: '#f87171', flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>{toast.message}</div>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8 }}
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1: Personal Information */}
        <div className="form-section-title">
          <IconUser className="w-5 h-5" /> Personal Information
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name *</label>
            <div className="input-wrapper">
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="e.g. Alexander Wright"
                className={`form-input ${touched.fullName && errors.fullName ? 'is-invalid' : ''}`}
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <IconUser className="input-icon" />
            </div>
            {touched.fullName && errors.fullName && (
              <div className="error-message">
                <IconAlertTriangle className="w-4 h-4" /> {errors.fullName}
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label" htmlFor="phoneNumber">Phone Number *</label>
            <div className="input-wrapper">
              <input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                placeholder="Digits only, e.g. 1234567890"
                className={`form-input ${touched.phoneNumber && errors.phoneNumber ? 'is-invalid' : ''}`}
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <IconPhone className="input-icon" />
            </div>
            {touched.phoneNumber && errors.phoneNumber && (
              <div className="error-message">
                <IconAlertTriangle className="w-4 h-4" /> {errors.phoneNumber}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Account Credentials */}
        <div className="form-section-title" style={{ marginTop: '1.5rem' }}>
          <IconMail className="w-5 h-5" /> Account Credentials
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {/* Username */}
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username *</label>
            <div className="input-wrapper">
              <input
                id="username"
                type="text"
                name="username"
                placeholder="e.g. alex_wright"
                className={`form-input ${touched.username && errors.username ? 'is-invalid' : ''}`}
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <IconUser className="input-icon" />
            </div>
            {touched.username && errors.username && (
              <div className="error-message">
                <IconAlertTriangle className="w-4 h-4" /> {errors.username}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address *</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                name="email"
                placeholder="alex@company.com"
                className={`form-input ${touched.email && errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <IconMail className="input-icon" />
            </div>
            {touched.email && errors.email && (
              <div className="error-message">
                <IconAlertTriangle className="w-4 h-4" /> {errors.email}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Security & Role Assignment */}
        <div className="form-section-title" style={{ marginTop: '1.5rem' }}>
          <IconShield className="w-5 h-5" /> Security & Role Assignment
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password *</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                className={`form-input ${touched.password && errors.password ? 'is-invalid' : ''}`}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <IconLock className="input-icon" />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Bar */}
            {formData.password && (
              <div className="strength-meter-container">
                <div className="strength-bar-bg">
                  <div
                    className="strength-bar-fill"
                    style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: strength.color, fontWeight: '600', marginBottom: '0.5rem' }}>
                  <span>Password Strength: {strength.label}</span>
                </div>
              </div>
            )}

            {/* Password Criteria Checklist */}
            <div className="strength-rules-list" style={{ marginTop: '0.5rem' }}>
              <span className={`rule-badge ${passwordRules.minLength ? 'valid' : ''}`}>
                {passwordRules.minLength && <IconCheck className="w-3 h-3" />} 8+ chars
              </span>
              <span className={`rule-badge ${passwordRules.hasUpper ? 'valid' : ''}`}>
                {passwordRules.hasUpper && <IconCheck className="w-3 h-3" />} Uppercase
              </span>
              <span className={`rule-badge ${passwordRules.hasLower ? 'valid' : ''}`}>
                {passwordRules.hasLower && <IconCheck className="w-3 h-3" />} Lowercase
              </span>
              <span className={`rule-badge ${passwordRules.hasNumber ? 'valid' : ''}`}>
                {passwordRules.hasNumber && <IconCheck className="w-3 h-3" />} Number
              </span>
              <span className={`rule-badge ${passwordRules.hasSpecial ? 'valid' : ''}`}>
                {passwordRules.hasSpecial && <IconCheck className="w-3 h-3" />} Special Char
              </span>
            </div>

            {touched.password && errors.password && (
              <div className="error-message">
                <IconAlertTriangle className="w-4 h-4" /> {errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password *</label>
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <IconLock className="input-icon" />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="error-message">
                <IconAlertTriangle className="w-4 h-4" /> {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="form-group" style={{ marginTop: '1.25rem' }}>
          <label className="form-label">System Role Assignment *</label>
          <div className="role-group">
            <label className={`role-card ${formData.role === 'USER' ? 'active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="USER"
                checked={formData.role === 'USER'}
                onChange={handleChange}
              />
              <div>
                <div style={{ fontWeight: '600', color: '#fff', fontSize: '0.95rem' }}>Standard User</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Access to process and view invoices</div>
              </div>
            </label>

            <label className={`role-card ${formData.role === 'ADMIN' ? 'active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="ADMIN"
                checked={formData.role === 'ADMIN'}
                onChange={handleChange}
              />
              <div>
                <div style={{ fontWeight: '600', color: '#fff', fontSize: '0.95rem' }}>Administrator</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Full system access, management & controls</div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '2rem' }}>
          <button
            type="submit"
            className="btn-submit"
            disabled={!isFormValid || submitting}
          >
            {submitting ? (
              <>
                <div className="spinner" /> Creating User...
              </>
            ) : (
              <>
                <IconCheckCircle className="w-5 h-5" /> Create User
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
