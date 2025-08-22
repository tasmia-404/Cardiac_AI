
import React, { useState } from 'react';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const users = JSON.parse(localStorage.getItem('cardiac_care_users') || '{}');

      if (isLoginMode) {
        // Handle Login
        if (users[email] && users[email].password === password) {
          onLoginSuccess();
        } else {
          setError('Invalid email or password.');
        }
      } else {
        // Handle Registration
        if (users[email]) {
          setError('Email is already registered.');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          return;
        }
        users[email] = { password };
        localStorage.setItem('cardiac_care_users', JSON.stringify(users));
        onLoginSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800/50 border border-gray-700 p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h1 className="text-3xl font-bold ml-2 text-white">Cardiac Care</h1>
            </div>
            <h2 className="text-2xl font-semibold text-white">{isLoginMode ? 'Sign In' : 'Create Account'}</h2>
            <p className="text-gray-400 mt-1">{isLoginMode ? 'Welcome back!' : 'Join us to manage your heart health.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition-colors font-semibold"
            >
              {isLoginMode ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError(null);
            }}
            className="text-sm text-red-400 hover:underline"
          >
            {isLoginMode ? 'Need an account? Create one' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
