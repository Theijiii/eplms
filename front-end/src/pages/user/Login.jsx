
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

  // Check if loginData exists and determine the correct OTP based on username
  if (loginData) {
    let correctOtp = "";
    
    // Set different OTP codes for admin vs user
    if (loginData.username === "admin@eplms.com") {
      correctOtp = "121803"; // Admin OTP
    } else if (loginData.username === "user@eplms.com") {
      correctOtp = "061423"; // User OTP
    }

    // Demo OTP validation
    if (otpString === correctOtp) {
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
  } else {
    setOtpError("Login session expired. Please login again.");
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
      <div className="fixed inset-0 z-0 bg-[url('/GovServePH.png')] bg-center bg-contain bg-no-repeat opacity-15"></div>

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
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          {/* LEFT: Logo + Title + Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <img
                src="/GSM_logo.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
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
      <main className="relative z-10 container mx-auto px-6 py-8 flex-1">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Section - Features */}
          <div className="text-center lg:text-left space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent bg-size-600 animate-gradient">
              Abot-Kamay mo ang Serbisyong Publiko!
            </h2>
            <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Access government services conveniently through our digital platform. 
              Fast, secure, and reliable public service at your fingertips.
            </p>
          </div>

          {/* Right Section - Login Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md mx-auto w-full border border-white/20 hover:shadow-2xl transition-all duration-300 hover:translate-y-[-4px]">
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Mag-login</h2>
              <p className="text-gray-600 text-sm">Punan ang mga kailangan impormasyon upang ma-access ang iyong account</p>
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
              
              <div>
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
      <Footer />

      {/* Terms of Service Modal */}
{showTermsModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      
      {/* Header */}
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

      {/* Body */}
      <div className="px-6 py-4 space-y-4 text-sm leading-6">
        <p><strong>Welcome to GoServePH!</strong></p>
        <p>This GoServePH Services Agreement is a binding legal contract for the use of our software systems—which handle data input, monitoring, processing, and analytics between GoServePH and you, the registered user </p>
        <p>This Agreement details the terms and conditions for using our Services. By accessing or using any GoServePH Services, you agree to these terms. If you don't understand any part of this Agreement, please contact us at info@goserveph.com.</p>

        <h4 className="font-semibold">OVERVIEW OF THIS AGREEMENT</h4>
        <p>This document outlines the terms for your use of the GoServePH system:</p>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr>
              <th className="py-1 pr-4">Section</th>
              <th className="py-1">Topic</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-1 pr-4">Section A</td><td className="py-1">General Account Setup and Use</td></tr>
            <tr><td className="py-1 pr-4">Section B</td><td className="py-1">Technology, Intellectual Property, and Licensing</td></tr>
            <tr><td className="py-1 pr-4">Section C</td><td className="py-1">Payment Terms, Fees, and Billing</td></tr>
            <tr><td className="py-1 pr-4">Section D</td><td className="py-1">Data Usage, Privacy, and Security</td></tr>
            <tr><td className="py-1 pr-4">Section E</td><td className="py-1">Additional Legal Terms and Disclaimers</td></tr>
          </tbody>
        </table>

        {/* SECTION A */}
        <h4 className="font-semibold">SECTION A: GENERAL TERMS</h4>
        <p><strong>1. Your Account and Registration</strong></p>
        <p>a. Account Creation: To use our Services, you must create an Account. Your representative must provide us with required details, including your entity's name, address, contact person, email, phone number, relevant ID/tax number, and the nature of your business/activities.</p>
        <p>b. Review and Approval: We reserve the right to review and approve your application, which typically takes at least two (2) business days. We can deny or reject any application at our discretion.</p>
        <p>c. Eligibility: Only businesses, institutions, and other entities based in the Philippines are eligible to apply for a GoServePH Account.</p>
        <p>d. Representative Authority: You confirm that your Representative has the full authority to provide your information and legally bind your entity to this Agreement. We may ask for proof of this authority.</p>
        <p>e. Validation: We may require additional documentation at any time (e.g., business licenses, IDs) to verify your entity's ownership, control, and the information you provided.</p>

        <p><strong>2. Services and Support</strong></p>
        <p>We provide support for general account inquiries and issues that prevent the proper use of the system. Support includes resources available through our in-app Ticketing System and website documentation ("Documentation"). For further questions, contact us at support@goserveph.com.</p>

        <p><strong>3. Service Rules and Restrictions</strong></p>
        <p>a. Lawful Use: You must use the Services lawfully and comply with all applicable Philippine laws, rules, and regulations regarding your use of the Services and the transactions you facilitate ("Transactions").</p>
        <p>b. Prohibited Activities: You may not use the Services to facilitate illegal transactions, or for personal/household use. Specifically, you must not, nor allow others to:</p>
        <ul className="list-disc pl-5">
          <li>Access non-public systems or data.</li>
          <li>Copy, resell, or distribute the Services, Documentation, or system content.</li>
          <li>Use, transfer, or access data you do not own or have no documented rights to use.</li>
          <li>Act as a service agent for the Services.</li>
          <li>Transfer your rights under this Agreement.</li>
          <li>Bypass technical limitations or enable disabled features.</li>
          <li>Reverse engineer the Services (except where legally permitted).</li>
          <li>Interfere with the normal operation of the Services or impose an unreasonably large load on the system.</li>
        </ul>

                   <h4 className="font-semibold">SECTION B: TECHNOLOGY</h4>
            <p><strong>1. System Access and Updates</strong></p>
            <p>We provide access to the web system and/or mobile application. You must only use the Application as described in the Documentation. We will update the Application and Documentation periodically, which may add or remove features, and we will notify you of material changes.</p>
            
            <p><strong>2. Ownership of Intellectual Property (IP)</strong></p>
            <p>a. Your Data: You retain ownership of all your master data, raw transactional data, and generated reports gathered from the system.</p>
            <p>b. GoServePH IP: We exclusively own all rights, titles, and interests in the patents, copyrights, trademarks, system designs, and documentation ("GoServePH IP"). All rights in GoServePH IP not expressly granted to you are reserved by us.</p>
            <p>c. Ideas: If you submit comments or ideas for system improvements, you agree that we are free to use these Ideas without any attribution or compensation to you.</p>
            
            <p><strong>3. License Coverage</strong></p>
            <p>We grant you a non-exclusive and non-transferable license to electronically access and use the GoServePH IP only as described in this Agreement. We are not selling the IP to you, and you cannot sublicense it. We may revoke this license if you violate the Agreement.</p>
            
            <p><strong>4. References to Our Relationship</strong></p>
            <p>During the term of this Agreement, both you and we may publicly identify the other party as the service provider or client, respectively. If you object to us identifying you as a client, you must notify us at info@goserveph.com. Upon termination, both parties must remove all public references to the relationship.</p>
            
            <h4 className="font-semibold">SECTION C: PAYMENT TERMS AND CONDITIONS</h4>
            <p><strong>1. Service Fees</strong></p>
            <p>We will charge the Fees for set-up, access, support, penalties, and other transactions as described on the GoServePH website. We may revise the Fees at any time, with at least 30 days' notice before the revisions apply to you.</p>
            
            <p><strong>2. Payment Terms and Schedule</strong></p>
            <p>a. Billing: Your monthly bill for the upcoming month is generated by the system on the 21st day of the current month and is due after 5 days. Billing is based on the number of registered users ("End-User") as of the 20th day.</p>
            <p>b. Payment Method: All payments must be settled via our third-party Payment System Provider, PayPal. You agree to abide by all of PayPal's terms, and we are not responsible for any issues with their service.</p>
            
            <p><strong>3. Taxes</strong></p>
            <p>Fees exclude applicable taxes. You are solely responsible for remitting all taxes for your business to the appropriate Philippine tax and revenue authorities.</p>
            
            <p><strong>4. Payment Processing</strong></p>
            <p>We are not a bank and do not offer services regulated by the Bangko Sentral ng Pilipinas. We reserve the right to reject your application or terminate your Account if you are ineligible to use PayPal services.</p>
            
            <p><strong>5. Processing Disputes and Refunds</strong></p>
            <p>You must report disputes and refund requests by emailing us at billing@goserveph.com. Disputes will only be investigated if reported within 60 days from the billing date. If a refund is warranted, it will be issued as a credit memo for use on future bills.</p>
            
            <h4 className="font-semibold">SECTION D: DATA USAGE, PRIVACY AND SECURITY</h4>
            <p><strong>1. Data Usage Overview</strong></p>
            <p>Data security is a top priority. This section outlines our obligations when handling information.</p>
            <p>'PERSONAL DATA' is information that relates to and can identify a person.</p>
            <p>'USER DATA' is information that describes your business, operations, products, or services.</p>
            <p>'GoServePH DATA' is transactional data over our infrastructure, fraud analysis info, aggregated data, and other information originating from the Services.</p>
            <p>'DATA' means all of the above.</p>
            <p>We use Data to provide Services, mitigate fraud, and improve our systems. We do not provide Personal Data to unaffiliated parties for marketing purposes.</p>
            
            <p><strong>2. Data Protection and Privacy</strong></p>
            <p>a. Confidentiality: You will protect all Data received via the Services and only use it in connection with this Agreement. Neither party may use Personal Data for marketing without express consent. We may disclose Data if required by legal instruments (e.g., subpoena).</p>
            <p>b. Privacy Compliance: You affirm that you comply with all Laws governing the privacy and protection of the Data you provide to or access through the Services. You are responsible for obtaining all necessary consents from End-Users to allow us to collect, use, and disclose their Data.</p>
            <p>c. Data Processing Roles: You shall be the data controller, and we shall be the data intermediary. We will process the Personal Data only according to this Agreement and will implement appropriate measures to protect it.</p>
            <p>d. Data Mining: You may not mine the database or any part of it without our express consent.</p>
            
            <p><strong>3. Security Controls</strong></p>
            <p>We are responsible for protecting your Data using commercially reasonable administrative, technical, and physical security measures. However, no system is impenetrable. You agree that you are responsible for implementing your own firewall, anti-virus, anti-phishing, and other security measures ("Security Controls"). We may suspend your Account to maintain the integrity of the Services, and you waive the right to claim losses that result from such actions.</p>
            
            <h4 className="font-semibold">SECTION E: ADDITIONAL LEGAL TERMS</h4>
            <p><strong>1. Right to Amend</strong></p>
            <p>We can change or add to these terms at any time by posting the changes on our website. Your continued use of the Services constitutes your acceptance of the modified Agreement.</p>
            
            <p><strong>2. Assignment</strong></p>
            <p>You cannot assign this Agreement or your Account rights to anyone else without our prior written consent. We can assign this Agreement without your consent.</p>
            
            <p><strong>3. Force Majeure</strong></p>
            <p>Neither party will be liable for delays or non-performance caused by events beyond reasonable control, such as utility failures, acts of nature, or war. This does not excuse your obligation to pay fees.</p>
            
            <p><strong>4. Representations and Warranties</strong></p>
            <p>By agreeing, you warrant that:</p>
            <ul className="list-disc pl-5">
              <li>You are eligible to use the Services and have the authority to enter this Agreement.</li>
              <li>All information you provide is accurate and complete.</li>
              <li>You will comply with all Laws.</li>
              <li>You will not use the Services for fraudulent or illegal purposes.</li>
            </ul>
            
            <p><strong>5. No Warranties</strong></p>
            <p>We provide the Services and GoServePH IP "AS IS" and "AS AVAILABLE," without any express, implied, or statutory warranties of title, merchantability, fitness for a particular purpose, or non-infringement.</p>
            
            <p><strong>6. Limitation of Liability</strong></p>
            <p>We shall not be responsible or liable to you for any indirect, punitive, incidental, special, consequential, or exemplary damages resulting from your use or inability to use the Services, lost profits, personal injury, or property damage. We are not liable for damages arising from:</p>
            <ul className="list-disc pl-5">
              <li>Hacking, tampering, or unauthorized access to your Account.</li>
              <li>Your failure to implement Security Controls.</li>
              <li>Use of the Services inconsistent with the Documentation.</li>
              <li>Bugs, viruses, or interruptions to the Services.</li>
            </ul>
            <p>This Agreement and all incorporated policies constitute the entire agreement between you and GoServePH.</p>
 <h3 class="text-lg font-semibold">GoServePH Data Privacy Policy</h3>
                <p><strong>Protecting the information you and your users handle through our system is our highest priority.</strong> This policy outlines how GoServePH manages, secures, and uses your data.</p>
                <h4 class="font-semibold">1. How We Define and Use Data</h4>
                <p>In this policy, we define the types of data that flow through the GoServePH system:</p>
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr><th class="py-1 pr-4">Term</th><th class="py-1">Definition</th></tr>
                    </thead>
                    <tbody>
                        <tr><td class="py-1 pr-4">Personal Data</td><td class="py-1">Any information that can identify a specific person, whether directly or indirectly, shared or accessible through the Services.</td></tr>
                        <tr><td class="py-1 pr-4">User Data</td><td class="py-1">Information that describes your business operations, services, or internal activities.</td></tr>
                        <tr><td class="py-1 pr-4">GoServePH Data</td><td class="py-1">Details about transactions and activity on our platform, information used for fraud detection, aggregated data, and any non-personal information generated by our system.</td></tr>
                        <tr><td class="py-1 pr-4">DATA</td><td class="py-1">Used broadly to refer to all the above: Personal Data, User Data, and GoServePH Data.</td></tr>
                    </tbody>
                </table>
                <h4 class="font-semibold">Our Commitment to Data Use</h4>
                <p>We analyze and manage data only for the following critical purposes:</p>
                <ul class="list-disc pl-5">
                    <li>To provide, maintain, and improve the GoServePH Services for you and all other users.</li>
                    <li>To detect and mitigate fraud, financial loss, or other harm to you or other users.</li>
                    <li>To develop and enhance our products, systems, and tools.</li>
                </ul>
                <p>We will not sell or share Personal Data with unaffiliated parties for their marketing purposes. By using our system, you consent to our use of your Data in this manner.</p>
                <h4 class="font-semibold">2. Data Protection and Compliance</h4>
                <p><strong>Confidentiality</strong></p>
                <p>We commit to using Data only as permitted by our agreement or as specifically directed by you. You, in turn, must protect all Data you access through GoServePH and use it only in connection with our Services. Neither party may use Personal Data to market to third parties without explicit consent.</p>
                <p>We will only disclose Data when legally required to do so, such as through a subpoena, court order, or search warrant.</p>
                <p><strong>Privacy Compliance and Responsibilities</strong></p>
                <p><em>Your Legal Duty:</em> You affirm that you are, and will remain, compliant with all applicable Philippine laws (including the Data Privacy Act of 2012) governing the collection, protection, and use of the Data you provide to us.</p>
                <p><em>Consent:</em> You are responsible for obtaining all necessary rights and consents from your End-Users to allow us to collect, use, and store their Personal Data.</p>
                <p><em>End-User Disclosure:</em> You must clearly inform your End-Users that GoServePH processes transactions for you and may receive their Personal Data as part of that process.</p>
                <p><strong>Data Processing Roles</strong></p>
                <p>When we process Personal Data on your behalf, we operate under the following legal roles:</p>
                <ul class="list-disc pl-5">
                    <li>You are the Data Controller (you determine why and how the data is processed).</li>
                    <li>We are the Data Intermediary (we process data strictly according to your instructions).</li>
                </ul>
                <p>As the Data Intermediary, we commit to:</p>
                <ul class="list-disc pl-5">
                    <li>Implementing appropriate security measures to protect the Personal Data we process.</li>
                    <li>Not retaining Personal Data longer than necessary to fulfill the purposes set out in our agreement.</li>
                </ul>
                <p>You acknowledge that we rely entirely on your instructions. Therefore, we are not liable for any claims resulting from our actions that were based directly or indirectly on your instructions.</p>
                <p><strong>Prohibited Activities</strong></p>
                <p>You are strictly prohibited from data mining the GoServePH database or any portion of it without our express written permission.</p>
                <p><strong>Breach Notification</strong></p>
                <p>If we become aware of an unauthorized acquisition, disclosure, change, or loss of Personal Data on our systems (a "Breach"), we will notify you and provide sufficient information to help you mitigate any negative impact, consistent with our legal obligations.</p>
                <h4 class="font-semibold">3. Account Deactivation and Data Deletion</h4>
                <p><strong>Initiating Deactivation</strong></p>
                <p>If you wish to remove your personal information from our systems, you must go to your Edit Profile page and click the 'Deactivate Account' button. This action initiates the data deletion and account deactivation process.</p>
                <p><strong>Data Retention</strong></p>
                <p>Upon deactivation, all of your Personal Identifying Information will be deleted from our systems.</p>
                <p><em>Important Note:</em> Due to the nature of our role as a Government Services Management System, and for legal, accounting, and audit purposes, we are required to retain some of your non-personal account activity history and transactional records. You will receive a confirmation email once your request has been fully processed.</p>
                <h4 class="font-semibold">4. Security Controls and Responsibilities</h4>
                <p><strong>Our Security</strong></p>
                <p>We are responsible for implementing commercially reasonable administrative, technical, and physical procedures to protect Data from unauthorized access, loss, or modification. We comply with all applicable Laws in handling Data.</p>
                <p><strong>Your Security Controls</strong></p>
                <p>You acknowledge that no security system is perfect. You agree to implement your own necessary security measures ("Security Controls"), which must include:</p>
                <ul class="list-disc pl-5">
                    <li>Firewall and anti-virus systems.</li>
                    <li>Anti-phishing systems.</li>
                    <li>End-User and device management policies.</li>
                    <li>Data handling protocols.</li>
                </ul>
                <p>We reserve the right to suspend your Account or the Services if necessary to maintain system integrity and security, or to prevent harm. You waive any right to claim losses that result from a Breach or any action we take to prevent harm.</p>
            </div>
            <div class="border-t px-6 py-3 flex justify-end">
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end space-x-3">
        <button 
          type="button" 
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={handleCloseTermsModal}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={handleAgreeToTerms}
        >
          Agree & Continue
        </button>
      </div>

    </div>
  </div>
)}


      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">OTP Verification</h3>
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
            
            <div className="px-6 py-6 space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Enter Verification Code</h4>
                <p className="text-gray-600 text-sm">
                  Your verification code has been sent to your email address. Enter the 6-digit code here.
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
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
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {otpError}
                  </div>
                )}
                {otpSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {otpSuccess}
                  </div>
                )}

                <div className="flex items-center justify-between">
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

              <div className="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
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
    </div>
  );
}

