import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SettingsContext = createContext();
export const useSettings = () => useContext(SettingsContext);

const DEFAULT_SETTINGS = {
  businessName: 'La Bella Aesthetic',
  tagline: 'Where Beauty Meets Artistry',
  phone: '+27 69 563 0922',
  email: 'labellaaesthethis12@gmail.com',
  address: '102 Marshall St, Polokwane Central, Polokwane, 0700',
  whatsapp: '+27695630922',
  instagram: 'https://www.instagram.com/la_bella_aesthetic/',
  facebook: 'https://facebook.com/labellaaesthetic',
  tiktok: 'https://tiktok.com/@labellaaesthetic',
  bankName: 'FNB',
  accountHolder: 'La Bella Aesthetic',
  accountNumber: '630 38829 272',
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
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3647.184355839751!2d29.448625074094306!3d-23.91852507480858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ec6d78f378a54f3%3A0x871af43450814e19!2s102%20Marshall%20St%2C%20Polokwane%20Central%2C%20Polokwane%2C%200700!5e0!3m2!1sen!2sza!4v1781582668391!5m2!1sen!2sza" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
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
