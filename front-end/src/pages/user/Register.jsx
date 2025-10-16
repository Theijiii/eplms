import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [proofFiles, setProofFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleProofChange = (e) => {
    const files = Array.from(e.target.files || []);
    setProofFiles(files);
  };

  const validate = () => {
    setError('');
    if (!email) return setError('Email is required.') && false;
    if (!password || password.length < 8) return setError('Password must be at least 8 characters.') && false;
    if (password !== confirmPassword) return setError('Passwords do not match.') && false;
    if (role === 'admin' && proofFiles.length === 0) return setError('Please upload proof documents for admin registration.') && false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    setIsSubmitting(true);

    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess('Registration successful. You can now login.');
      setTimeout(() => navigate('/login'), 1500);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-auto flex items-center justify-center p-6 bg-gray-50"
      style={{ fontFamily: 'Segoe UI, Arial, Helvetica Neue, sans-serif' }}
    >
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#4CAF50' }}>Register</h1>
        <p className="text-sm text-gray-600 mb-4">Select your role and fill in the required information.</p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-700 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Register as</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setRole('user')} className="mr-2" />
                user
              </label>
              <label className="flex items-center">
                <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} className="mr-2" />
                Admin / Government Staff
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              required
              className="w-full p-3 border rounded"
              placeholder="Email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              required
              minLength={8}
              className="w-full p-3 border rounded"
              placeholder="Password (min 8 chars)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
              required
              minLength={8}
              className="w-full p-3 border rounded"
              placeholder="Confirm password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Name (optional)</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full p-3 border rounded"
              placeholder="Your full name"
            />
          </div>

          {role === 'admin' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload proof of government employment / ID (PDF, JPG, PNG)
              </label>
              <input
                type="file"
                multiple
                onChange={handleProofChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full p-2 border rounded"
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for admin verification. Files will be reviewed by the administrator.
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 rounded text-white font-semibold"
              style={{ background: isSubmitting ? '#9aa5b1' : '#4CAF50' }}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-[#4A90E2] font-medium">
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
