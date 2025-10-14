
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
    if ((username === "admin" || username === "user@example.com") && password === "password123") {
      setSuccess("Login successful!");
      setError("");
      setTimeout(() => {
        if (username === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }, 1000);
    } else {
      setError("Invalid username/email or password.");
    }
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-auto"
      style={{
        fontFamily: 'Segoe UI, Arial, Helvetica Neue, sans-serif',
        background: '#ffffff'
      }}
    >
      {/* Overlay for readability - reduced opacity for more visible background */}
  {/* Removed background overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8">
          {/* Logo, System Name, Tagline */}
          <div className="text-center">
            <img src="/perlogo.png" alt="GoServePH Logo" className="h-15 w-15" />
            <h1 className="text-4xl font-extrabold mb-1" style={{ color: '#4CAF50', fontFamily: 'inherit' }}>GoServePH</h1>
            <p className="text-lg font-medium mb-4" style={{ color: '#4A90E2', fontFamily: 'inherit' }}>Serbisyong Publiko, Abot-Kamay Mo</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mag-login</h2>
            <p className="text-gray-600">Punan ang mga kailangan impormasyon upang ma-access ang iyong account</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>
          )}

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username o Email
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  minLength={3}
                  maxLength={50}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200"
                  placeholder="Ilagay ang iyong username o email"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    maxLength={128}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200"
                    placeholder="Ilagay ang iyong password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A90E2] hover:text-[#FDA811]"
                    tabIndex={-1}
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Tandaan
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium" style={{ color: '#4A90E2' }}>Nakalimutan ang password?</a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white"
                style={{ backgroundColor: '#4CAF50', fontFamily: 'inherit' }}
              >
                Mag-login
              </button>z
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Wala pang account?
                <button onClick={() => navigate('/register')} className="font-medium ml-2" style={{ color: '#FDA811' }}>
                  Mag-register dito
                </button>
              </p>
            </div>
          </form>

          {/* Security Features */}
          <div className="mt-8 space-y-4">
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#E3F6FF', borderColor: '#4A90E2' }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: '#4A90E2' }}>Mga Paalala sa Seguridad:</h3>
              <ul className="text-xs space-y-1" style={{ color: '#4A90E2' }}>
                <li>• Siguraduhing tama ang impormasyong ilalagay</li>
                <li>• Huwag ibahagi ang iyong password sa iba</li>
                <li>• Kung may problema, tumawag sa IT Department</li>
                <li>• Account ay maaaring ma-lock pagkatapos ng 5 failed attempts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
