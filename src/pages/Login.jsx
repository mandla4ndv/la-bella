import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
      toast.success('Welcome back!');
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : 'Login failed. Please try again.';
      toast.error(msg);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Helmet><title>Login | La Bella Aesthetic</title></Helmet>
      <div className="min-h-screen flex items-center justify-center pt-20 pb-20 px-6 bg-gradient-to-br from-cream to-blush/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-8">
              <span className="font-display text-3xl text-charcoal block">La Bella</span>
              <span className="text-[9px] tracking-[0.45em] text-gold uppercase font-body">Aesthetic</span>
            </Link>
            <h1 className="font-display text-4xl text-charcoal mb-2">Welcome Back</h1>
            <p className="text-warm-gray font-body font-300 text-sm">Sign in to manage your appointments</p>
          </div>

          <div className="bg-white border border-gold/15 p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="section-label mb-2">Email Address</label>
                <input type="email" required autoComplete="email" placeholder="your@email.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-luxury" />
              </div>
              <div>
                <label className="section-label mb-2">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                    placeholder="••••••••" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="input-luxury pr-12" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-rose transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-rose hover:text-rose-deep transition-colors font-body">
                  Forgot password?
                </Link>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 disabled:opacity-50">
                <LogIn size={14} />
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="text-center text-sm text-warm-gray font-body mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-rose hover:text-rose-deep transition-colors font-500">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
