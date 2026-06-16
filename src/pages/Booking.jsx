import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { CheckCircle2, ChevronRight, Clock, Calendar, User, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = ['Service', 'Date & Time', 'Your Details', 'Summary', 'Payment'];

const FALLBACK_SERVICES = [
  // Facials & Skin Care
  { id: '1', name: 'LED Facial: Acne & Scarring', price: 200, duration: 30, category: 'Facials' },
  { id: '2', name: 'LED Facial: Pigmentation', price: 200, duration: 30, category: 'Facials' },
  { id: '3', name: 'LED Facial: Spider Veins', price: 200, duration: 30, category: 'Facials' },
  { id: '4', name: 'LED Facial: Skin Rejuvenation', price: 200, duration: 30, category: 'Facials' },
  { id: '5', name: 'Basic Facial', price: 350, duration: 60, category: 'Facials' },
  { id: '6', name: 'Basic Facial with Mask/Scrub', price: 400, duration: 60, category: 'Facials' },
  { id: '7', name: 'Deep Cleansing Facial', price: 450, duration: 60, category: 'Facials' },

  // Hair Removal
  { id: '8', name: 'Hair Removal: Upper Lip & Chin', price: 200, duration: 30, category: 'Hair Removal' },
  { id: '9', name: 'Hair Removal: Brazilian', price: 450, duration: 45, category: 'Hair Removal' },
  { id: '10', name: 'Hair Removal: Half Legs', price: 350, duration: 45, category: 'Hair Removal' },
  { id: '11', name: 'Hair Removal: Male Back', price: 450, duration: 45, category: 'Hair Removal' },
  { id: '12', name: 'Hair Removal: Arms', price: 300, duration: 45, category: 'Hair Removal' },
  { id: '13', name: 'Hair Removal: Face', price: 300, duration: 30, category: 'Hair Removal' },
  { id: '14', name: 'Hair Removal: Full Legs', price: 500, duration: 60, category: 'Hair Removal' },
  { id: '15', name: 'Hair Removal: Under Arms', price: 300, duration: 30, category: 'Hair Removal' },
  { id: '16', name: 'Hair Removal: Anal', price: 550, duration: 30, category: 'Hair Removal' },
  { id: '17', name: 'Hair Removal: Head', price: 600, duration: 45, category: 'Hair Removal' },
  { id: '18', name: 'Hair Removal: Chest', price: 400, duration: 45, category: 'Hair Removal' },

  // IPL Treatments
  { id: '19', name: 'IPL: Acne & Scarring', price: 250, duration: 30, category: 'IPL Treatments' },
  { id: '20', name: 'IPL: Pigmentation', price: 250, duration: 30, category: 'IPL Treatments' },
  { id: '21', name: 'IPL: Spider Veins', price: 350, duration: 30, category: 'IPL Treatments' },
  { id: '22', name: 'IPL: Skin Rejuvenation', price: 350, duration: 30, category: 'IPL Treatments' },

  // Slimming Treatments
  { id: '23', name: 'Laser Lipo', price: 250, duration: 20, category: 'Slimming Treatments' },
  { id: '24', name: 'Cavitation', price: 250, duration: 20, category: 'Slimming Treatments' },
  { id: '25', name: 'Visible Cellulite Reduction', price: 350, duration: 40, category: 'Slimming Treatments' },
  { id: '26', name: 'Infrared Sauna Blanket', price: 250, duration: 20, category: 'Slimming Treatments' },
  { id: '27', name: 'Sauna Blanket & Cavitation', price: 450, duration: 40, category: 'Slimming Treatments' },
  { id: '28', name: 'Fat Freeze', price: 550, duration: 60, category: 'Slimming Treatments' },

  // Non-Surgical Body Contouring
  { id: '29', name: 'Breast / Bum Augmentation', price: 450, duration: 45, category: 'Body Contouring' },
  
  // Skin Tightening
  { id: '30', name: 'Skin Tightening: Abdomen', price: 400, duration: 60, category: 'Skin Tightening' },
  { id: '31', name: 'Skin Tightening: Hands', price: 400, duration: 60, category: 'Skin Tightening' },
  { id: '32', name: 'Skin Tightening: Love Handles', price: 400, duration: 60, category: 'Skin Tightening' },
  { id: '33', name: 'Skin Tightening: Double Chin', price: 250, duration: 30, category: 'Skin Tightening' },
  { id: '34', name: 'Skin Tightening: Thighs', price: 400, duration: 60, category: 'Skin Tightening' },
  { id: '35', name: 'Skin Tightening: Chest', price: 350, duration: 30, category: 'Skin Tightening' },
  { id: '36', name: 'Skin Tightening: Saddle Bags', price: 400, duration: 60, category: 'Skin Tightening' },

  // Specialized Treatments
  { id: '37', name: 'Radio Frequency: Anti-Aging', price: 450, duration: 50, category: 'Specialized Treatments' },
  { id: '38', name: 'Radio Frequency: Wrinkle Reduction', price: 450, duration: 50, category: 'Specialized Treatments' },
  { id: '39', name: 'Bedroom Vitality (External)', price: 600, duration: 30, category: 'Specialized Treatments' },
  { id: '40', name: 'Reduction of Scarring & Stretch Marks', price: 400, duration: 30, category: 'Specialized Treatments' },
  { id: '41', name: 'Laser Hair Regrowth', price: 180, duration: 30, category: 'Specialized Treatments' },

  // Massages
  { id: '42', name: 'Swedish Relax Massage (Full Body - 60 Min)', price: 550, duration: 60, category: 'Massages' },
  { id: '43', name: 'Swedish Relax Massage (Full Body - 90 Min)', price: 750, duration: 90, category: 'Massages' },
  { id: '44', name: 'Swedish Massage: Back & Neck', price: 350, duration: 30, category: 'Massages' },
  { id: '45', name: 'Swedish Massage: Hand & Foot', price: 250, duration: 30, category: 'Massages' },
  { id: '46', name: 'Hot Stone Massage (Full Body - 90 Min)', price: 700, duration: 90, category: 'Massages' },
  { id: '47', name: 'Hot Stone Massage: Back & Neck', price: 400, duration: 30, category: 'Massages' },
  { id: '48', name: 'Indian Massage (30 Min)', price: 300, duration: 30, category: 'Massages' },
  { id: '49', name: 'Indian Massage (60 Min)', price: 450, duration: 60, category: 'Massages' }
];

function generateTimeSlots(openTime, closeTime, durationMins, bookedSlots = []) {
  const slots = [];
  const [oh, om] = openTime.split(':').map(Number);
  const [ch, cm] = closeTime.split(':').map(Number);
  let cur = oh * 60 + om;
  const end = ch * 60 + cm;
  while (cur + durationMins <= end) {
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    const label = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    slots.push({ time: label, available: !bookedSlots.includes(label) });
    cur += 30;
  }
  return slots;
}

function getDayName(dateStr) {
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  return days[new Date(dateStr).getDay()];
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { settings } = useSettings();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [details, setDetails] = useState({ fullName: '', email: '', phone: '', notes: '' });
  const [bookingRef, setBookingRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const preselectedId = searchParams.get('service');

  // Load services
  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'services'), where('active', '==', true));
        const snap = await getDocs(q);
        const list = snap.empty ? FALLBACK_SERVICES : snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setServices(list);
        if (preselectedId) {
          const found = list.find(s => s.id === preselectedId);
          if (found) { setSelectedService(found); setStep(1); }
        }
      } catch {
        setServices(FALLBACK_SERVICES);
        if (preselectedId) {
          const found = FALLBACK_SERVICES.find(s => s.id === preselectedId);
          if (found) { setSelectedService(found); setStep(1); }
        }
      }
    };
    fetch();
  }, [preselectedId]);

  // Pre-fill user details
  useEffect(() => {
    if (user && userProfile) {
      setDetails(d => ({
        ...d,
        fullName: userProfile.fullName || user.displayName || '',
        email: user.email || '',
        phone: userProfile.phone || '',
      }));
    }
  }, [user, userProfile]);

  // Load booked slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    const fetch = async () => {
      try {
        const q = query(
          collection(db, 'appointments'),
          where('date', '==', selectedDate),
          where('status', 'not-in', ['cancelled'])
        );
        const snap = await getDocs(q);
        const times = snap.docs.map(d => d.data().time);
        setBookedTimes(times);
      } catch { setBookedTimes([]); }
    };
    fetch();
  }, [selectedDate]);

  // Generate slots
  useEffect(() => {
    if (!selectedDate || !selectedService) return;
    const dayName = getDayName(selectedDate);
    const dayHours = settings.businessHours?.[dayName];
    if (!dayHours || dayHours.closed) { setSlots([]); return; }
    const generated = generateTimeSlots(dayHours.open, dayHours.close, selectedService.duration, bookedTimes);
    setSlots(generated);
  }, [selectedDate, selectedService, bookedTimes, settings.businessHours]);

  const deposit = selectedService ? Math.round(selectedService.price * (settings.depositPercent || 50) / 100) : 0;

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().split('T')[0];
  };

  const isDateBlocked = (dateStr) => {
    const blocked = settings.blockedDates || [];
    if (blocked.includes(dateStr)) return true;
    const dayName = getDayName(dateStr);
    return settings.businessHours?.[dayName]?.closed;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const ref = `LB-${Date.now().toString(36).toUpperCase()}`;
      const bookingData = {
        reference: ref,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        deposit,
        date: selectedDate,
        time: selectedTime,
        fullName: details.fullName,
        email: details.email,
        phone: details.phone,
        notes: details.notes,
        status: 'pending_payment',
        createdAt: serverTimestamp(),
        userId: user?.uid || null,
      };
      await addDoc(collection(db, 'appointments'), bookingData);
      setBookingRef(ref);
      setStep(4);
    } catch (e) {
      toast.error('Booking failed. Please try again.');
    }
    setLoading(false);
  };

  const copyText = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const formatDate = (str) => {
    if (!str) return '';
    return new Date(str + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Layout>
      <Helmet>
        <title>Book an Appointment | La Bella Aesthetic</title>
      </Helmet>

      {/* Header */}
      <div className="pt-36 pb-14 bg-gradient-to-b from-cream to-white px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-label">Reservations</span>
          <h1 className="section-title">Book Your Appointment</h1>
          <div className="gold-divider" />
        </motion.div>
      </div>

      {/* Step Progress */}
      {step < 4 && (
        <div className="bg-white border-b border-gold/15 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex">
              {STEPS.slice(0, 4).map((s, i) => (
                <div key={s} className="flex-1 relative">
                  <div className={`py-4 text-center border-b-2 transition-all ${
                    i === step ? 'border-rose text-rose' :
                    i < step ? 'border-gold text-gold' :
                    'border-transparent text-warm-gray/40'
                  }`}>
                    <span className={`w-6 h-6 rounded-full text-[10px] font-body font-500 mx-auto mb-1 flex items-center justify-center ${
                      i < step ? 'bg-gold text-white' :
                      i === step ? 'bg-rose text-white' :
                      'border border-warm-gray/20 text-warm-gray/40'
                    }`}>
                      {i < step ? <Check size={10} /> : i + 1}
                    </span>
                    <p className="text-[10px] tracking-widest uppercase font-body hidden sm:block">{s}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 0: Select Service */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 className="font-display text-3xl text-charcoal mb-8">Choose a Treatment</h2>
                {Object.entries(
                  services.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {})
                ).map(([cat, catServices]) => (
                  <div key={cat} className="mb-8">
                    <p className="section-label mb-4">{cat}</p>
                    <div className="space-y-3">
                      {catServices.map(service => (
                        <button
                          key={service.id}
                          onClick={() => { setSelectedService(service); setStep(1); }}
                          className={`w-full flex items-center justify-between p-5 border text-left transition-all hover:border-gold ${
                            selectedService?.id === service.id ? 'border-rose bg-rose/3' : 'border-gold/20 bg-white'
                          }`}
                        >
                          <div>
                            <p className="font-body font-500 text-charcoal">{service.name}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1 text-xs text-warm-gray font-body">
                                <Clock size={11} /> {service.duration} min
                              </span>
                              <span className="text-xs text-warm-gray font-body">
                                Deposit: R{Math.round(service.price * 0.5)?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <p className="font-display text-2xl text-charcoal">R{service.price?.toLocaleString()}</p>
                            <ChevronRight size={16} className="ml-auto mt-1 text-gold" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 1: Date & Time */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="flex items-center gap-3 mb-8">
                  <button onClick={() => setStep(0)} className="text-xs tracking-widest uppercase font-body text-warm-gray hover:text-rose transition-colors">
                    ← Back
                  </button>
                  <span className="text-warm-gray/30">|</span>
                  <p className="font-body text-sm text-warm-gray">{selectedService?.name} — <span className="text-rose">R{selectedService?.price?.toLocaleString()}</span></p>
                </div>
                <h2 className="font-display text-3xl text-charcoal mb-8">Choose Date & Time</h2>

                <div className="mb-8">
                  <label className="section-label mb-3">Select Date</label>
                  <input
                    type="date"
                    min={getMinDate()}
                    max={getMaxDate()}
                    value={selectedDate}
                    onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                    className="input-luxury max-w-xs"
                  />
                  {selectedDate && isDateBlocked(selectedDate) && (
                    <p className="text-rose text-sm font-body mt-2">This date is unavailable. Please choose another.</p>
                  )}
                </div>

                {selectedDate && !isDateBlocked(selectedDate) && (
                  <div>
                    <label className="section-label mb-4">Available Times</label>
                    {slots.length === 0 ? (
                      <p className="text-warm-gray font-body text-sm">No available slots for this date.</p>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {slots.map(slot => (
                          <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`py-2.5 text-xs font-body font-500 transition-all border ${
                              !slot.available ? 'bg-warm-gray/10 text-warm-gray/30 border-transparent cursor-not-allowed line-through' :
                              selectedTime === slot.time ? 'bg-rose text-white border-rose' :
                              'bg-white border-gold/20 text-charcoal hover:border-gold'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedDate || !selectedTime || isDateBlocked(selectedDate)}
                  className="btn-primary mt-10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <button onClick={() => setStep(1)} className="text-xs tracking-widest uppercase font-body text-warm-gray hover:text-rose transition-colors mb-8 block">
                  ← Back
                </button>
                <h2 className="font-display text-3xl text-charcoal mb-8">Your Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className="section-label mb-2">Full Name *</label>
                    <input type="text" placeholder="Your full name" value={details.fullName}
                      onChange={e => setDetails(d => ({ ...d, fullName: e.target.value }))}
                      className="input-luxury" />
                  </div>
                  <div>
                    <label className="section-label mb-2">Email Address *</label>
                    <input type="email" placeholder="your@email.com" value={details.email}
                      onChange={e => setDetails(d => ({ ...d, email: e.target.value }))}
                      className="input-luxury" />
                  </div>
                  <div>
                    <label className="section-label mb-2">Phone Number *</label>
                    <input type="tel" placeholder="+27 72 000 0000" value={details.phone}
                      onChange={e => setDetails(d => ({ ...d, phone: e.target.value }))}
                      className="input-luxury" />
                  </div>
                  <div>
                    <label className="section-label mb-2">Special Requests (Optional)</label>
                    <textarea rows={3} placeholder="Any allergies, special requirements or questions..."
                      value={details.notes}
                      onChange={e => setDetails(d => ({ ...d, notes: e.target.value }))}
                      className="input-luxury resize-none" />
                  </div>
                </div>
                <button
                  onClick={() => setStep(3)}
                  disabled={!details.fullName || !details.email || !details.phone}
                  className="btn-primary mt-8 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Review Booking
                </button>
              </motion.div>
            )}

            {/* Step 3: Summary */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <button onClick={() => setStep(2)} className="text-xs tracking-widest uppercase font-body text-warm-gray hover:text-rose transition-colors mb-8 block">
                  ← Back
                </button>
                <h2 className="font-display text-3xl text-charcoal mb-8">Booking Summary</h2>

                <div className="bg-cream border border-gold/20 p-8 space-y-5 mb-8">
                  {[
                    { label: 'Treatment', value: selectedService?.name },
                    { label: 'Date', value: formatDate(selectedDate) },
                    { label: 'Time', value: selectedTime },
                    { label: 'Duration', value: `${selectedService?.duration} minutes` },
                    { label: 'Full Name', value: details.fullName },
                    { label: 'Email', value: details.email },
                    { label: 'Phone', value: details.phone },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-3 border-b border-gold/10 last:border-0">
                      <span className="text-[10px] tracking-widest uppercase font-body text-warm-gray/60">{label}</span>
                      <span className="text-sm font-body text-charcoal font-500 text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                  <div className="pt-4 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] tracking-widest uppercase font-body text-warm-gray/60">Treatment Price</span>
                      <span className="font-display text-2xl text-charcoal">R{selectedService?.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-rose/5 border border-rose/20 px-4 -mx-0">
                      <span className="text-xs font-body font-500 text-rose uppercase tracking-wider">Deposit Required (50%)</span>
                      <span className="font-display text-2xl text-rose">R{deposit?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary w-full justify-center py-4 disabled:opacity-50"
                >
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </motion.div>
            )}

            {/* Step 4: Payment Instructions */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={28} className="text-gold" />
                  </div>
                  <h2 className="font-display text-3xl text-charcoal mb-2">Booking Received!</h2>
                  <p className="text-warm-gray font-body font-300">Reference: <span className="font-500 text-rose">{bookingRef}</span></p>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-6 mb-6">
                  <p className="text-amber-800 font-body text-sm leading-relaxed">
                    <strong>Your booking is currently pending payment.</strong> To secure your appointment, please pay the 50% deposit via EFT using the banking details below. Your appointment will be confirmed once payment is verified.
                  </p>
                </div>

                <div className="bg-cream border border-gold/20 p-8 mb-6">
                  <h3 className="section-label mb-6">Banking Details</h3>
                  {[
                    { label: 'Account Name', value: settings.accountHolder, key: 'name' },
                    { label: 'Bank', value: settings.bankName, key: 'bank' },
                    { label: 'Account Number', value: settings.accountNumber, key: 'acc' },
                    { label: 'Branch Code', value: settings.branchCode, key: 'branch' },
                    { label: 'Account Type', value: settings.accountType, key: 'type' },
                    { label: 'Reference', value: bookingRef, key: 'ref' },
                  ].map(({ label, value, key }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-gold/10 last:border-0">
                      <span className="text-[10px] tracking-widest uppercase font-body text-warm-gray/60">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-body font-500 text-charcoal">{value}</span>
                        <button onClick={() => copyText(value, key)} className="text-gold hover:text-rose transition-colors">
                          {copied === key ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-5 p-4 bg-rose/5 border border-rose/15">
                    <p className="text-sm font-body font-500 text-rose">Deposit Amount: R{deposit?.toLocaleString()}</p>
                    <p className="text-xs text-warm-gray font-body mt-1">Use your booking reference <strong>{bookingRef}</strong> as payment reference.</p>
                  </div>
                </div>

                <div className="bg-white border border-gold/15 p-6 mb-6 space-y-2">
                  <p className="text-sm font-body text-charcoal flex items-start gap-2">
                    <span className="text-gold mt-0.5">✦</span>
                    Please bring proof of payment on the day of your appointment.
                  </p>
                  <p className="text-sm font-body text-charcoal flex items-start gap-2">
                    <span className="text-gold mt-0.5">✦</span>
                    You may also WhatsApp your proof of payment to us.
                  </p>
                  <p className="text-sm font-body text-charcoal flex items-start gap-2">
                    <span className="text-gold mt-0.5">✦</span>
                    Your booking status will be updated to <strong>Confirmed</strong> once payment is verified.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=Hi! I've just made a booking (${bookingRef}) and would like to send proof of payment.`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-primary flex-1 justify-center"
                  >
                    WhatsApp Proof of Payment
                  </a>
                  {user ? (
                    <button onClick={() => navigate('/dashboard')} className="btn-outline flex-1">
                      View My Bookings
                    </button>
                  ) : (
                    <button onClick={() => navigate('/')} className="btn-outline flex-1">
                      Back to Home
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
