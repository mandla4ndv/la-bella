# La Bella Aesthetic — Complete Website

> Premium aesthetic clinic website for **La Bella Aesthetic**, Polokwane, South Africa.
> React + Vite + Firebase + Tailwind CSS + Framer Motion.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase
1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable **Authentication** > Email/Password
4. Create a **Firestore Database** in production mode
5. Enable **Storage**
6. Copy your Firebase config

### 3. Configure Environment Variables
```bash
cp .env.example .env
```
Fill in your Firebase credentials in `.env`.

### 4. Apply Security Rules
- Firestore Rules: paste contents of `firestore.rules`
- Storage Rules: paste contents of `storage.rules`

### 5. Create Your First Admin
1. Register at `/register`
2. In Firestore > `users` collection, find your document
3. Set `role` field to `"admin"`
4. Access `/admin`

### 6. Run Locally
```bash
npm run dev
```

---

## Pages

| Page | URL |
|------|-----|
| Home | `/` |
| About | `/about` |
| Services | `/services` |
| Gallery | `/gallery` |
| Booking | `/booking` |
| Contact | `/contact` |
| Login | `/login` |
| Register | `/register` |
| Customer Dashboard | `/dashboard` |
| Admin Panel | `/admin` |

---

## Admin Dashboard Features

| Section | What You Can Do |
|---------|----------------|
| Overview | Stats, recent bookings |
| Appointments | View all, filter, update status |
| Services | Add/edit/delete/activate services |
| Gallery | Upload images to Firebase Storage |
| Testimonials | Add/edit/delete/hide reviews |
| Users | Manage roles |
| Settings | Business info, hours, banking, content, blocked dates |

---

## Booking Flow

1. Select service
2. Choose date + available time slot
3. Enter personal details
4. Review summary (price + 50% deposit)
5. Receive banking details + booking reference
6. Status starts as `pending_payment`

### Admin Status Workflow
```
pending_payment -> deposit_received -> confirmed -> completed
```

---

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import at vercel.com
3. Add environment variables
4. Deploy

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login && firebase init hosting
npm run build && firebase deploy
```

---

## Monthly Costs (ZA)

| Item | Cost |
|------|------|
| Vercel | R0-R400 |
| Firebase | R0-R500 |
| Domain (.co.za) | ~R10 |
| **Total** | **~R10-R910** |

---

## Tech Stack

React 18 · Vite 6 · React Router 6 · Tailwind CSS 3 · Framer Motion · Firebase 11 (Auth + Firestore + Storage) · React Helmet Async · React Hot Toast · Lucide React
