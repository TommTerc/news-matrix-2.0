import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle, FaTwitter, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

type AuthMode = 'signin' | 'signup';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication
    console.log('Auth data:', { mode, email, password, name });
  };

  const handleGoogleAuth = () => {
    // TODO: Implement Google auth
    console.log('Google auth');
  };

  const handleTwitterAuth = () => {
    // TODO: Implement Twitter auth
    console.log('Twitter auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 font-mono pt-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-gradient-to-b from-gray-900/95 via-gray-800/98 to-gray-900/95 p-8 rounded-lg border border-matrix-green/30 hover:shadow-lg hover:shadow-matrix-green/20 transition-all">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-matrix-green mb-2">
            {mode === 'signin' ? 'Access the Matrix' : 'Join the Matrix'}
          </h2>
          <p className="text-matrix-green/60">
            {mode === 'signin' 
              ? 'Enter your credentials to continue'
              : 'Create your account to join the network'
            }
          </p>
        </div>

        <div className="space-y-4">
          {/* Social Auth Buttons */}
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 bg-matrix-green/10 hover:bg-matrix-green/20 text-matrix-green py-3 rounded-lg border border-matrix-green/30 transition-colors"
          >
            <FaGoogle />
            Continue with Google
          </button>
          
          <button
            onClick={handleTwitterAuth}
            className="w-full flex items-center justify-center gap-3 bg-matrix-green/10 hover:bg-matrix-green/20 text-matrix-green py-3 rounded-lg border border-matrix-green/30 transition-colors"
          >
            <FaTwitter />
            Continue with Twitter
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-matrix-green/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-matrix-dark text-matrix-green/60">Or continue with email</span>
            </div>
          </div>

          {/* Email Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-matrix-green/80 text-sm font-bold mb-2">
                  Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-matrix-green/60" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-matrix-dark border border-matrix-green/30 rounded-lg pl-10 pr-4 py-3 text-matrix-green focus:outline-none focus:border-matrix-green"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-matrix-green/80 text-sm font-bold mb-2">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-matrix-green/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-matrix-dark border border-matrix-green/30 rounded-lg pl-10 pr-4 py-3 text-matrix-green focus:outline-none focus:border-matrix-green"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-matrix-green/80 text-sm font-bold mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-matrix-green/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-matrix-dark border border-matrix-green/30 rounded-lg pl-10 pr-4 py-3 text-matrix-green focus:outline-none focus:border-matrix-green"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-matrix-green text-matrix-black font-bold py-3 rounded-lg hover:bg-matrix-light transition-colors"
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <div className="text-center text-matrix-green/60">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-matrix-green hover:text-matrix-light"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-matrix-green hover:text-matrix-light"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}