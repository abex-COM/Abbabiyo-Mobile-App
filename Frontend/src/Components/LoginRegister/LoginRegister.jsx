import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope, FaGlobe } from 'react-icons/fa';
import { FaRegMoon } from 'react-icons/fa6';
import { MdOutlineLanguage } from "react-icons/md";
import { TiWeatherSunny } from "react-icons/ti";
import { register, login } from './api';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';
import { tokens } from './theme';

// Translation dictionary
const translations = {
  en: {
    login: "Login",
    register: "Register",
    username: "Username",
    password: "Password",
    fullName: "Full Name",
    email: "Email",
    rememberMe: "Remember me",
    forgotPassword: "Forgot Password",
    agreeTerms: "I agree to the terms & conditions",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
  },
  am: {
    login: "ግባ",
    register: "ይመዝገቡ",
    username: "የተጠቃሚ ስም",
    password: "የይለፍ ቃል",
    fullName: "ሙሉ ስም",
    email: "ኢሜይል",
    rememberMe: "አስታውሰኝ",
    forgotPassword: "የይለፍ ቃል ረሳኽው?",
    agreeTerms: "ከውሎች ጋር ተስማምቻለሁ",
    noAccount: "መለያ የሎትህ?",
    haveAccount: "ቀድሞ መለያ አለህ?",
  },
  om: {
    login: "Seeni",
    register: "Galmeessi",
    username: "Maqaa Fayyadamaa",
    password: "Jecha Darbii",
    fullName: "Maqaa Guutuu",
    email: "Email",
    rememberMe: "Na Yaadadhu",
    forgotPassword: "Jecha Darbii Dagadhe?",
    agreeTerms: "Haala fi Seera Waliin Walii Galadha",
    noAccount: "Akkaawuntii Hin Qabduu?",
    haveAccount: "Akkaawuntii Qabduu?",
  },
  ti: {
   login: "እተው",
   register: "ተመዝገብ",
   username: "ስም ተጠቃሚ",
   password: "መሕለፊ ቃል",
   fullName: "ምሉእ ስም",
   email: "ኢመይል",
   rememberMe: "ዘክርኒ",
   forgotPassword: "መሕለፊ ቃል ረሲዕካ?",
   agreeTerms: "ምስ ስርዓት ተሰማሚዐ",
   noAccount: "ኣካውንት የብልካን?",
   haveAccount: "ቀደም ኣካውንት ኣለካ?",
 },
};

// Language Dropdown Component
const LanguageDropdown = ({ onLanguageChange, isOpen, onMouseEnter, onMouseLeave, colors }) => {
   const languages = [
      { code: 'en', name: 'Eng' },
      { code: 'am', name: 'Amh' },
      { code: 'om', name: 'A/O' },
      { code: 'ti', name: 'Tig' }, 
    ];

  return (
    <div
      style={{
        position: 'absolute',
        right: '0',
        top: '40px',
        backgroundColor: colors.primary[500],
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: isOpen ? 'block' : 'none',
        zIndex: 1000,
        color: colors.grey[100],
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {languages.map((lang) => (
        <div
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          style={{
            padding: '10px',
            cursor: 'pointer',
            color: colors.grey[100],
            borderBottom: '1px solid #ddd',
            transition: 'color 0.3s ease',
            backgroundColor: 'transparent', // Transparent background
          }}
          onMouseEnter={(e) => (e.target.style.color = '#00bfff')} // Bright blue on hover
          onMouseLeave={(e) => (e.target.style.color = colors.grey[100])} // Revert to original color
        >
          {lang.name}
        </div>
      ))}
    </div>
  );
};

// Main LoginRegister Component
const LoginRegister = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
  });
  const [action, setAction] = useState('');
  const [isNightMode, setIsNightMode] = useState(false);
  const [language, setLanguage] = useState('en'); // Default to English
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Initialize language from session storage or browser preference
  useEffect(() => {
    const savedLanguage = sessionStorage.getItem('preferredLanguage'); // Get language from session storage
    if (savedLanguage) {
      setLanguage(savedLanguage); // Set the language if found
    } else {
      // Fallback to detecting browser language if no saved language exists
      const userLanguage = navigator.language.split('-')[0]; // Get base language (e.g., 'en' from 'en-US')
      if (translations[userLanguage]) {
        setLanguage(userLanguage); // Set to user's preferred language if available
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      console.log('Login successful:', res.data.token);
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      alert('Login failed. Please check your credentials.');
    } finally {
      setFormData({
        fullName: '',
        username: '',
        email: '',
        password: '',
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData);
      console.log('Registration response:', res);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        alert('Registration successful!');
        setFormData({
          fullName: '',
          username: '',
          email: '',
          password: '',
        });
      } else {
        throw new Error('Token not found in response');
      }
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
      setFormData({
        fullName: '',
        username: '',
        email: '',
        password: '',
      });
    }
  };

  const registerLink = () => setAction(' active');
  const loginLink = () => setAction('');

  const toggleTheme = () => {
    setIsNightMode(!isNightMode);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    sessionStorage.setItem('preferredLanguage', lang); // Store language in session storage
    setIsLanguageDropdownOpen(false);
    console.log('Language changed to:', lang);
  };

  const toggleLanguageDropdown = (isOpen) => {
    setIsLanguageDropdownOpen(isOpen);
  };

  const colors = tokens(isNightMode ? 'light' : 'dark');

  return (
    <div className={`containerbox ${isNightMode ? 'day-mode' : 'night-mode'}`} style={{ backgroundColor: colors.primary[500] }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="theme-toggle" onClick={toggleTheme} style={{ color: colors.grey[100] }}>
          {isNightMode ? <TiWeatherSunny /> : <FaRegMoon />}
        </div>
        <div
          onMouseEnter={(e) => {
            toggleLanguageDropdown(true);
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.border = `2px solid ${colors.greenAccent[500]}`;
            e.currentTarget.style.backgroundColor = colors.primary[400];
          }}
          onMouseLeave={(e) => {
            toggleLanguageDropdown(false);
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.border = 'none';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          style={{
            cursor: 'pointer',
            color: colors.grey[100],
            position: 'absolute',
            right: '20px',
            top: '80px',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
          }}
        >
          <MdOutlineLanguage size={25} />
          <LanguageDropdown
            onLanguageChange={handleLanguageChange}
            isOpen={isLanguageDropdownOpen}
            onMouseEnter={() => toggleLanguageDropdown(true)}
            onMouseLeave={() => toggleLanguageDropdown(false)}
            colors={colors}
          />
        </div>
      </div>
      <div className={`wrapper${action}`} style={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>{translations[language].login}</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder={translations[language].username}
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{ color: colors.grey[100], border: `1px solid ${colors.grey[100]}` }}
              />
              <FaUser className="icon" style={{ color: colors.grey[100] }} />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder={translations[language].password}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ color: colors.grey[100], border: `1px solid ${colors.grey[100]}` }}
              />
              <FaLock className="icon" style={{ color: colors.grey[100] }} />
            </div>
            <div className="remember-forgot">
              <label htmlFor=""><input type="checkbox" /> {translations[language].rememberMe}</label>
              <a href="#">{translations[language].forgotPassword}</a>
            </div>
            <button type="submit" style={{ color: colors.grey[100], border: `1px solid ${colors.grey[100]}` }}>
              {translations[language].login}
            </button>
            <div className="register-link">
              <p>
                {translations[language].noAccount}{' '}
                <button type="button" className="link-button router" onClick={registerLink} style={{ color: colors.greenAccent[500] }}>
                  {translations[language].register}
                </button>
              </p>
            </div>
          </form>
        </div>

            {/* Register Form */}
            <div className="form-box register">
            <form onSubmit={handleRegister}>
               <h1>{translations[language].register}</h1>
               <div className="input-box">
                  <input
                  type="text"
                  placeholder={translations[language].fullName}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  style={{ color: colors.grey[100], border: `1px solid ${colors.grey[100]}` }}
                  />
                  <FaUser className="icon" style={{ color: colors.grey[100] }} />
               </div>
               <div className="input-box">
                  <input
                  type="text"
                  placeholder={translations[language].username}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={{ color: colors.grey[100], border: `1px solid ${colors.grey[100]}` }}
                  />
                  <FaUser className="icon" style={{ color: colors.grey[100] }} />
               </div>
               <div className="input-box">
                  <input
                  type="email"
                  placeholder={translations[language].email}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ color: colors.grey[100], border: `1px solid ${colors.grey[100]}` }}
                  />
                  <FaEnvelope className="icon" style={{ color: colors.grey[100] }} />
               </div>
               <div className="input-box">
                  <input
                  type="password"
                  placeholder={translations[language].password}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ color: colors.grey[100], border: `1px solid ${colors.grey[100]}` }}
                  />
                  <FaLock className="icon" style={{ color: colors.grey[100] }} />
               </div>
               <div className="remember-forgot">
                  <label htmlFor="">
                  <input type="checkbox" /> {translations[language].agreeTerms}
                  </label>
               </div>
               <button type="submit" style={{ color: colors.grey[100], border: `1px solid ${colors.grey[100]}` }}>
                  {translations[language].register}
               </button>
               <div className="register-link">
                  <p>
                  {translations[language].haveAccount}{' '}
                  <button
                     type="button"
                     className="link-button router"
                     onClick={loginLink}
                     style={{ color: colors.greenAccent[500] }}
                  >
                     {translations[language].login}
                  </button>
                  </p>
               </div>
            </form>
            </div>
      </div>
    </div>
  );
};

export default LoginRegister;