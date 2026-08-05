import React, { FormEvent, useState } from 'react';
import { Lock } from 'lucide-react';
import { loginAdmin } from '../../api/adminAuth';

type AdminLoginProps = {
  onLogin: () => void;
};

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await loginAdmin(username, password);
      localStorage.setItem('elpida_admin_token', response.token);
      onLogin();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#2D1424] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-[#E6DDD6] bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#2D1424] text-white">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Admin Login</h1>
            <p className="text-sm text-[#6E5E67]">Elpida dashboard access</p>
          </div>
        </div>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium">Username</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-md border border-[#D8CCC4] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
            autoComplete="username"
            required
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium">Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="w-full rounded-md border border-[#D8CCC4] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
            autoComplete="current-password"
            required
          />
        </label>

        {error && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-[#2D1424] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3A1A2E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
