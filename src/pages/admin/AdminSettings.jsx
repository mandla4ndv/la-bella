import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../contexts/SettingsContext';
import { Save, MapPin, Phone, DollarSign, Clock, Globe, Ban } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const DAY_LABELS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const TABS = [
  { id: 'business', label: 'Business Info', icon: Globe },
  { id: 'hours', label: 'Business Hours', icon: Clock },
  { id: 'banking', label: 'Banking Details', icon: DollarSign },
  { id: 'content', label: 'Page Content', icon: MapPin },
  { id: 'blocked', label: 'Blocked Dates', icon: Ban },
];

export default function AdminSettings() {
  const { settings, updateSettings } = useSettings();
  const [local, setLocal] = useState({ ...settings });
  const [activeTab, setActiveTab] = useState('business');
  const [saving, setSaving] = useState(false);
  const [newBlockDate, setNewBlockDate] = useState('');

  const set = (key, value) => setLocal(prev => ({ ...prev, [key]: value }));
  const setHours = (day, field, value) =>
    setLocal(prev => ({ ...prev, businessHours: { ...prev.businessHours, [day]: { ...prev.businessHours?.[day], [field]: value } } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(local);
      toast.success('Settings saved!');
    } catch { toast.error('Save failed.'); }
    setSaving(false);
  };

  const addBlockedDate = () => {
    if (!newBlockDate) return;
    if (local.blockedDates?.includes(newBlockDate)) { toast.error('Date already blocked.'); return; }
    setLocal(prev => ({ ...prev, blockedDates: [...(prev.blockedDates || []), newBlockDate].sort() }));
    setNewBlockDate('');
  };

  const removeBlockedDate = (date) => setLocal(prev => ({ ...prev, blockedDates: prev.blockedDates.filter(d => d !== date) }));

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
    <div>
      <label className="section-label mb-2">{label}</label>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} className="input-luxury" />
    </div>
  );

  return (
    <>
      <Helmet><title>Settings | Admin</title></Helmet>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="section-label">Configure</span>
            <h1 className="font-display text-4xl text-charcoal">Settings</h1>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Tab sidebar */}
          <div className="lg:w-52 flex-shrink-0">
            <div className="bg-white border border-gold/15 overflow-hidden">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-[11px] tracking-widest uppercase font-body transition-all border-l-2 ${
                    activeTab === id ? 'border-rose text-rose bg-rose/3' : 'border-transparent text-warm-gray hover:text-charcoal hover:bg-cream/30'
                  }`}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-grow bg-white border border-gold/15 p-6 lg:p-8">
            {activeTab === 'business' && (
              <div className="space-y-5">
                <h2 className="font-display text-2xl text-charcoal mb-6">Business Information</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField label="Business Name" value={local.businessName} onChange={v => set('businessName', v)} />
                  <InputField label="Tagline" value={local.tagline} onChange={v => set('tagline', v)} />
                </div>
                <InputField label="Phone Number" value={local.phone} onChange={v => set('phone', v)} placeholder="+27 72 000 0000" />
                <InputField label="WhatsApp Number (digits only)" value={local.whatsapp} onChange={v => set('whatsapp', v)} placeholder="27720000000" />
                <InputField label="Email Address" value={local.email} onChange={v => set('email', v)} type="email" />
                <div>
                  <label className="section-label mb-2">Business Address</label>
                  <textarea rows={2} value={local.address || ''} onChange={e => set('address', e.target.value)}
                    className="input-luxury resize-none" />
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  <InputField label="Instagram URL" value={local.instagram} onChange={v => set('instagram', v)} />
                  <InputField label="Facebook URL" value={local.facebook} onChange={v => set('facebook', v)} />
                  <InputField label="TikTok URL" value={local.tiktok} onChange={v => set('tiktok', v)} />
                </div>
                <InputField label="Google Maps Embed URL" value={local.mapEmbedUrl} onChange={v => set('mapEmbedUrl', v)} />
                <div>
                  <label className="section-label mb-2">Deposit Percentage</label>
                  <div className="flex items-center gap-3">
                    <input type="number" min={0} max={100} value={local.depositPercent || 50}
                      onChange={e => set('depositPercent', Number(e.target.value))}
                      className="input-luxury w-24" />
                    <span className="text-sm font-body text-warm-gray">% of service price</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hours' && (
              <div>
                <h2 className="font-display text-2xl text-charcoal mb-6">Business Hours</h2>
                <div className="space-y-3">
                  {DAYS.map((day, i) => {
                    const h = local.businessHours?.[day] || { open: '09:00', close: '17:00', closed: false };
                    return (
                      <div key={day} className={`flex items-center gap-4 py-3 border-b border-gold/10 flex-wrap ${h.closed ? 'opacity-60' : ''}`}>
                        <span className="w-28 text-sm font-body font-500 text-charcoal">{DAY_LABELS[i]}</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={!h.closed} onChange={e => setHours(day, 'closed', !e.target.checked)}
                            className="accent-rose w-4 h-4" />
                          <span className="text-xs font-body text-warm-gray">Open</span>
                        </label>
                        {!h.closed && (
                          <>
                            <div className="flex items-center gap-2">
                              <input type="time" value={h.open || '09:00'} onChange={e => setHours(day, 'open', e.target.value)}
                                className="input-luxury py-2 px-3 w-32 text-sm" />
                              <span className="text-warm-gray text-sm">to</span>
                              <input type="time" value={h.close || '17:00'} onChange={e => setHours(day, 'close', e.target.value)}
                                className="input-luxury py-2 px-3 w-32 text-sm" />
                            </div>
                          </>
                        )}
                        {h.closed && <span className="text-xs tracking-widest uppercase font-body text-warm-gray/50">Closed</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 p-4 bg-cream border border-gold/20">
                  <p className="text-xs font-body text-warm-gray">
                    <strong>Slot Duration:</strong> Appointment time slots are generated based on each service's duration. Minimum gap between slots is 30 minutes.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'banking' && (
              <div className="space-y-5">
                <h2 className="font-display text-2xl text-charcoal mb-6">Banking Details</h2>
                <p className="text-sm text-warm-gray font-body font-300 leading-relaxed mb-6">
                  These details are shown to clients during the booking process to facilitate deposit payments.
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField label="Account Holder Name" value={local.accountHolder} onChange={v => set('accountHolder', v)} />
                  <InputField label="Bank Name" value={local.bankName} onChange={v => set('bankName', v)} />
                  <InputField label="Account Number" value={local.accountNumber} onChange={v => set('accountNumber', v)} />
                  <InputField label="Branch Code" value={local.branchCode} onChange={v => set('branchCode', v)} />
                  <InputField label="Account Type" value={local.accountType} onChange={v => set('accountType', v)} placeholder="Cheque / Savings" />
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-5">
                <h2 className="font-display text-2xl text-charcoal mb-6">Page Content</h2>
                <InputField label="Hero Title" value={local.heroTitle} onChange={v => set('heroTitle', v)} />
                <div>
                  <label className="section-label mb-2">Hero Subtitle</label>
                  <textarea rows={2} value={local.heroSubtitle || ''} onChange={e => set('heroSubtitle', e.target.value)}
                    className="input-luxury resize-none" />
                </div>
                <div>
                  <label className="section-label mb-2">About / Our Story</label>
                  <textarea rows={4} value={local.aboutStory || ''} onChange={e => set('aboutStory', e.target.value)}
                    className="input-luxury resize-none" />
                </div>
                <div>
                  <label className="section-label mb-2">Mission Statement</label>
                  <textarea rows={3} value={local.aboutMission || ''} onChange={e => set('aboutMission', e.target.value)}
                    className="input-luxury resize-none" />
                </div>
                <div>
                  <label className="section-label mb-2">Vision Statement</label>
                  <textarea rows={3} value={local.aboutVision || ''} onChange={e => set('aboutVision', e.target.value)}
                    className="input-luxury resize-none" />
                </div>
              </div>
            )}

            {activeTab === 'blocked' && (
              <div>
                <h2 className="font-display text-2xl text-charcoal mb-6">Blocked Dates</h2>
                <p className="text-sm text-warm-gray font-body font-300 mb-6">
                  Blocked dates will not accept new bookings (e.g. public holidays, staff leave, clinic maintenance).
                </p>
                <div className="flex gap-3 mb-6">
                  <input type="date" value={newBlockDate} onChange={e => setNewBlockDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-luxury max-w-[180px]" />
                  <button onClick={addBlockedDate} className="btn-primary py-2.5 px-6 text-xs">
                    Block Date
                  </button>
                </div>
                {(local.blockedDates || []).length === 0 ? (
                  <p className="text-sm text-warm-gray font-body py-8 text-center bg-cream border border-gold/15">No dates blocked</p>
                ) : (
                  <div className="space-y-2">
                    {local.blockedDates.map(date => (
                      <div key={date} className="flex items-center justify-between py-3 px-4 bg-cream border border-gold/15">
                        <span className="text-sm font-body text-charcoal">
                          {new Date(date + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => removeBlockedDate(date)}
                          className="text-xs tracking-widest uppercase font-body text-red-400 hover:text-red-500 transition-colors">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
