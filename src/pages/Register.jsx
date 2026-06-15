import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match.'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form.email, form.password, form.fullName, form.phone);
      navigate('/dashboard');
      toast.success('Account created! Welcome to La Bella.');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'An account with this email already exists.' : 'Registration failed. Please try again.';
      toast.error(msg);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Helmet><title>Create Account | La Bella Aesthetic</title></Helmet>
      <div className="min-h-screen flex items-center justify-center pt-20 pb-20 px-6 bg-gradient-to-br from-cream to-blush/10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-8">
              <span className="font-display text-3xl text-charcoal block">La Bella</span>
              <span className="text-[9px] tracking-[0.45em] text-gold uppercase font-body">Aesthetic</span>
            </Link>
            <h1 className="font-display text-4xl text-charcoal mb-2">Create Account</h1>
            <p className="text-warm-gray font-body font-300 text-sm">Join La Bella to manage your bookings</p>
          </div>

          <div className="bg-white border border-gold/15 p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="section-label mb-2">Full Name *</label>
                <input type="text" required placeholder="Your full name"
                  value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className="input-luxury" />
              </div>
              <div>
                <label className="section-label mb-2">Email Address *</label>
                <input type="email" required placeholder="your@email.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-luxury" />
              </div>
              <div>
                <label className="section-label mb-2">Phone Number *</label>
                <input type="tel" required placeholder="+27 72 000 0000"
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="input-luxury" />
              </div>
              <div>
                <label className="section-label mb-2">Password *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required placeholder="Min. 6 characters"
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="input-luxury pr-12" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-rose transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="section-label mb-2">Confirm Password *</label>
                <input type="password" required placeholder="Confirm password"
                  value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  className="input-luxury" />
              </div>
              <p className="text-xs text-warm-gray font-body leading-relaxed">
                By creating an account you agree to our{' '}
                <Link to="/terms" className="text-rose">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="text-rose">Privacy Policy</Link>.
              </p>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 disabled:opacity-50">
                <UserPlus size={14} />
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-warm-gray font-body mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-rose hover:text-rose-deep font-500">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
