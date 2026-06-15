import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SettingsContext = createContext();
export const useSettings = () => useContext(SettingsContext);

const DEFAULT_SETTINGS = {
  businessName: 'La Bella Aesthetic',
  tagline: 'Where Beauty Meets Artistry',
  phone: '+27 72 000 0000',
  email: 'hello@labellaaesthetic.co.za',
  address: '123 Dorp Street, Polokwane, Limpopo, 0699',
  whatsapp: '+27720000000',
  instagram: 'https://instagram.com/labellaaesthetic',
  facebook: 'https://facebook.com/labellaaesthetic',
  tiktok: 'https://tiktok.com/@labellaaesthetic',
  bankName: 'FNB',
  accountHolder: 'La Bella Aesthetic',
  accountNumber: '62xxxxxxxxx',
  branchCode: '250655',
  accountType: 'Cheque',
  businessHours: {
    monday: { open: '09:00', close: '17:00', closed: false },
    tuesday: { open: '09:00', close: '17:00', closed: false },
    wednesday: { open: '09:00', close: '17:00', closed: false },
    thursday: { open: '09:00', close: '17:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '09:00', close: '13:00', closed: false },
    sunday: { open: '', close: '', closed: true },
  },
  blockedDates: [],
  slotDurationMinutes: 60,
  depositPercent: 50,
  heroTitle: 'Unveil Your Most Radiant Self',
  heroSubtitle: 'Premium aesthetic treatments tailored to reveal your natural beauty. Experience luxury skincare in the heart of Polokwane.',
  aboutStory: 'La Bella Aesthetic was founded with a single vision: to bring world-class aesthetic treatments to Polokwane. Our team of certified professionals combines advanced techniques with personalised care, ensuring every client leaves feeling confident and radiant.',
  aboutMission: 'To empower every client through evidence-based aesthetic treatments that enhance natural beauty, delivered in an environment of luxury, trust, and care.',
  aboutVision: 'To be the most trusted and celebrated aesthetic clinic in Limpopo, setting the standard for excellence in beauty and skincare.',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57543.36!2d29.4651!3d-23.9005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ec6782b30938be7%3A0x9b9e1e0e0e0e0e0e!2sPolokwane!5e0!3m2!1sen!2sza!4v1000000000000',
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'main'));
        if (snap.exists()) setSettings({ ...DEFAULT_SETTINGS, ...snap.data() });
      } catch (e) { /* use defaults */ }
      setLoading(false);
    };
    fetch();
  }, []);

  const updateSettings = async (updates) => {
    const merged = { ...settings, ...updates };
    await setDoc(doc(db, 'settings', 'main'), merged, { merge: true });
    setSettings(merged);
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
