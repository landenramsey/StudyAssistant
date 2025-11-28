import { useState } from 'react';
import { FiUser, FiLock, FiCalendar, FiBook, FiArrowRight, FiLogIn } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';
import './SignIn.css';

function SignIn({ onSignIn }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    year: '',
    major: ''
  });
  const [errors, setErrors] = useState({});

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
  const majors = [
    'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Computer Science',
    'Engineering', 'Psychology', 'Business', 'Education', 'Nursing',
    'Marine Biology', 'Environmental Science', 'English', 'History',
    'Political Science', 'Communication Studies', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (!formData.year) {
      newErrors.year = 'Please select your year';
    }
    if (!formData.major) {
      newErrors.major = 'Please select your major';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(formData));
      onSignIn(formData);
    }
  };

  return (
    <div className="sign-in-page">
      <div className="sign-in-container">
        <div className="sign-in-header">
          <HiAcademicCap className="sign-in-logo" />
          <h1>UNCW Study Assistant</h1>
          <p>Sign in to get personalized study help</p>
        </div>

        <form onSubmit={handleSubmit} className="sign-in-form">
          <div className="form-group">
            <label>
              <FiUser className="label-icon" />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>
              <FiLock className="label-icon" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>
              <FiCalendar className="label-icon" />
              Year
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={errors.year ? 'error' : ''}
            >
              <option value="">Select your year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.year && <span className="error-message">{errors.year}</span>}
          </div>

          <div className="form-group">
            <label>
              <FiBook className="label-icon" />
              Major
            </label>
            <select
              name="major"
              value={formData.major}
              onChange={handleChange}
              className={errors.major ? 'error' : ''}
            >
              <option value="">Select your major</option>
              {majors.map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
            {errors.major && <span className="error-message">{errors.major}</span>}
          </div>

          <button type="submit" className="sign-in-button">
            <FiLogIn className="button-icon" />
            <span>Sign In</span>
            <FiArrowRight className="button-icon" />
          </button>
        </form>

        <p className="sign-in-note">
          Your information helps us provide personalized study assistance based on your major.
        </p>
      </div>
    </div>
  );
}

export default SignIn;

