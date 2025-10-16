import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from '../../components/user/Footer';


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loginData, setLoginData] = useState(null);
  const navigate = useNavigate();

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Header visibility on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== "down" && scrollY > 50) {
        setIsVisible(true);
      } else if (direction === "down" && scrollY > 50) {
        setIsVisible(false);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, []);

  // Dummy login logic for demonstration
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!username || !password) {
      setError("Please enter both username/email and password.");
      return;
    }
    // Replace with real API call
    if ((username === "admin@eplms.com" || username === "user@eplms.com") && password === "password123") {
      setSuccess("Credentials verified! Sending OTP...");
      setError("");
      
      // Store login data for after OTP verification
      setLoginData({ username, password });
      
      // Simulate OTP sending
      setTimeout(() => {
        setShowOtpModal(true);
        setCountdown(30); // 30 seconds countdown
        setSuccess("");
      }, 1500);
    } else {
      setError("Invalid username/email or password.");
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth logic here
    console.log("Google login clicked");
  };

  const handleRegisterClick = () => {
    // Show terms modal first
    setShowTermsModal(true);
  };

  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
  };

  const handleAgreeToTerms = () => {
    setShowTermsModal(false);
    // Navigate to registration page after agreeing to terms
    navigate('/register');
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').split('').slice(0, 6);
    
    if (pastedNumbers.length === 6) {
      const newOtp = [...otp];
      pastedNumbers.forEach((num, index) => {
        newOtp[index] = num;
      });
      setOtp(newOtp);
      
      // Focus last input
      const lastInput = document.getElementById(`otp-5`);
      if (lastInput) lastInput.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpSuccess("");
    
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }

    // Demo OTP validation - in real app, this would be verified with backend
    if (otpString === "061423") { // Demo OTP
      setOtpSuccess("OTP verified successfully!");
      
      setTimeout(() => {
        setShowOtpModal(false);
        if (loginData) {
          if (loginData.username === "admin@eplms.com") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        }
      }, 1000);
    } else {
      setOtpError("Invalid OTP code. Please try again.");
    }
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    setOtpError("");
    setOtpSuccess("Resending OTP...");
    
    // Simulate OTP resend
    setTimeout(() => {
      setOtp(["", "", "", "", "", ""]);
      setCountdown(30);
      setIsResending(false);
      setOtpSuccess("New OTP has been sent to your registered mobile number.");
      
      // Focus first OTP input
      const firstInput = document.getElementById('otp-0');
      if (firstInput) firstInput.focus();
    }, 1500);
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpSuccess("");
    setLoginData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Image with Low Opacity */}
      <div className="fixed inset-0 z-0 bg-[url('/GovServePH.png')] bg-center bg-cover bg-no-repeat opacity-15"></div>

      {/* Animated Background Particles */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(76,175,80,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(74,144,226,0.1)_0%,transparent_50%),radial-gradient(circle_at_40%_40%,rgba(253,168,17,0.05)_0%,transparent_50%)] animate-pulse"></div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 bg-white shadow-sm border-b-4 border-[#FDA811] transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-6 py-2 flex justify-between items-center h-22">
          {/* LEFT: Logo + Title + Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-15 h-15 bg-white rounded-full flex items-center justify-center ">
              <img
                src="/GSM_logo.png"
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold">
                <span className="text-blue-700">Go</span>
                <span className="text-green-600">Serve</span>
                <span className="text-blue-700">PH</span>
              </span>
              <span className="text-sm text-gray-600">
                Serbisyong Publiko, Abot-Kamay Mo.
              </span>
            </div>
          </div>

          {/* RIGHT: Time and Date */}
          <div className="text-right text-sm text-gray-800">
            <div className="font-semibold">{time.toLocaleTimeString()}</div>
            <div>
              {time.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pt-8 pb-12 flex-1">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Section - Features */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
              Abot-Kamay mo ang Serbisyong Publiko!
            </h2>
            <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
              Access government services conveniently through our digital platform. 
              Fast, secure, and reliable public service at your fingertips.
            </p>
          </div>

          {/* Right Section - Login Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md mx-auto w-full border border-white/20 hover:shadow-2xl transition-all duration-300 hover:translate-y-[-4px]">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mag-login</h2>
              <p className="text-gray-600">Punan ang mga kailangan impormasyon upang ma-access ang iyong account</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  placeholder="Ilagay ang iyong username o email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    name="password" 
                    placeholder="Ilagay ang iyong password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Tandaan ako
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    Nakalimutan ang password?
                  </a>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Mag-login
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  type="button" 
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                  <span>Magpatuloy gamit ang Google</span>
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Wala pang account? 
                  <button 
                    type="button" 
                    className="text-blue-600 hover:text-blue-800 font-semibold ml-1 transition-colors"
                    onClick={handleRegisterClick}
                  >
                    Mag-register dito
                  </button>
                </p>
              </div>
            </form>

            {/* Security Features */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                <h3 className="text-sm font-medium mb-2 text-blue-800">Mga Paalala sa Seguridad:</h3>
                <ul className="text-xs space-y-1 text-blue-700">
                  <li>• Siguraduhing tama ang impormasyong ilalagay</li>
                  <li>• Huwag ibahagi ang iyong password sa iba</li>
                  <li>• Kung may problema, tumawag sa IT Department</li>
                  <li>• Account ay maaaring ma-lock pagkatapos ng 5 failed attempts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
    
      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-blue-700">GoServePH Terms of Service Agreement</h3>
              <button 
                type="button" 
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={handleCloseTermsModal}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-4 text-sm leading-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-semibold text-center">
                  📋 Please read the Terms of Service carefully before proceeding to registration
                </p>
              </div>
              
              <p><strong>Welcome to GoServePH!</strong></p>
              <p>This GoServePH Services Agreement ("Agreement") is a binding legal contract for the use of our software systems—which handle data input, monitoring, processing, and analytics—("Services") between GoServePH ("us," "our," or "we") and you, the registered user ("you" or "user").</p>
              <p>This Agreement details the terms and conditions for using our Services. By accessing or using any GoServePH Services, you agree to these terms. If you don't understand any part of this Agreement, please contact us at info@goserveph.com.</p>
              
              <h4 className="font-semibold text-blue-600 mt-6">OVERVIEW OF THIS AGREEMENT</h4>
              <p>This document outlines the terms for your use of the GoServePH system:</p>
              <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 font-semibold border-b">Section</th>
                    <th className="py-3 px-4 font-semibold border-b">Topic</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">Section A</td>
                    <td className="py-2 px-4">General Account Setup and Use</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">Section B</td>
                    <td className="py-2 px-4">Technology, Intellectual Property, and Licensing</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">Section C</td>
                    <td className="py-2 px-4">Payment Terms, Fees, and Billing</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">Section D</td>
                    <td className="py-2 px-4">Data Usage, Privacy, and Security</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">Section E</td>
                    <td className="py-2 px-4">Additional Legal Terms and Disclaimers</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="font-semibold text-blue-600 mt-6">KEY TERMS AND CONDITIONS</h4>
              <p>By proceeding with registration, you acknowledge that you have read, understood, and agree to be bound by:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All terms and conditions outlined in this agreement</li>
                <li>Our data privacy and security policies</li>
                <li>Payment terms and billing procedures</li>
                <li>Service usage rules and restrictions</li>
                <li>Termination and account closure procedures</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This is a summary of key terms. The full Terms of Service contains detailed information about your rights and responsibilities as a GoServePH user.
                </p>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between items-center">
              <button 
                type="button" 
                className="px-6 py-3 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors font-semibold"
                onClick={handleCloseTermsModal}
              >
                Cancel
              </button>
              <div className="flex space-x-3">
                <button 
                  type="button" 
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
                  onClick={handleAgreeToTerms}
                >
                  I Agree - Continue to Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="sticky top-0 bg-white  px-6 py-4 flex items-right justify-between">
              
              <button 
                type="button" 
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={closeOtpModal}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Enter Verification Code</h4>
                <p className="text-gray-600 text-sm">
                  Your verification code has been sent to your email address. Enter the 6-digit code here.
                </p>
              </div>

              <form onSubmit={handleOtpSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    6-Digit OTP Code
                  </label>
                  <div className="flex justify-between space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                {/* OTP Error/Success Messages */}
                {otpError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                    {otpError}
                  </div>
                )}
                {otpSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                    {otpSuccess}
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isResending}
                    className={`text-sm font-medium ${
                      countdown > 0 || isResending
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:text-blue-800 transition-colors'
                    }`}
                  >
                    {isResending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                  
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Verify OTP
                </button>
              </form>

              <div className="mt-6 p-4 rounded-lg border bg-yellow-50 border-yellow-200">
                <h5 className="text-sm font-medium mb-2 text-yellow-800 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Security Notice
                </h5>
                <ul className="text-xs space-y-1 text-yellow-700">
                  <li>• Never share your OTP with anyone</li>
                  <li>• This OTP will expire in 10 minutes</li>
                  <li>• Contact support if you didn't request this code</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
            <Footer />
    </div>
  );
}