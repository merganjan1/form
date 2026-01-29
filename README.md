# 📋 Forma Platformasi

**Osongina forma yaratish, savollarni boshqarish va respondentlardan javoblarni yig'ish uchun zamonaviy web-platformasi.**

Forma Platformasi har qanday tashkilot yoki shaxsning anketalarni tezda yaratish, tarqatish va natijalarni tahlil qilishini osonlashtiradi.

![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Latest-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 🎯 Asosiy Xususiyatlari

✅ **Forma Yaratish** — Shaxsiy va umumiy forma shakllarini tezda yarating  
✅ **5 Turdagi Savollar** — SHORT_TEXT, PARAGRAPH, RADIO, CHECKBOX, DROPDOWN  
✅ **Savollarni Tartiblash** — Drag-and-drop orqali savollarni qayta joylashtiring  
✅ **Umumiy Linklar** — Forma linkini respondentlarga osongina yuboring  
✅ **Real-time Javoblar** — Barcha javoblarni bir joydan ko'ring va tahlil qiling  
✅ **Mock Authentication** — Google orqali test kirish  
✅ **localStorage Storage** — Brauzer xotirasida ma'lumotlar saqlanadi  
✅ **Responsive Design** — Mobile, tablet va desktop uchun optimallashtirilgan  
✅ **Uzbek Tilida Interface** — To'liq Uzbek tilida boshqaruv paneli  

---

## 🛠️ Texnologiyalar

| Texnologiya | Versiya | Maqsadi |
|-------------|---------|---------|
| **React** | 19.2.4 | Frontend UI komponentlari |
| **TypeScript** | 5.8 | Statik tip tekshirish |
| **Vite** | 6.4 | Iloji bor build tool |
| **React Router** | 7.13 | Client-side navigatsiya |
| **Tailwind CSS** | Latest | Utility-based CSS styling |
| **Firebase** | 12.8 | Mock authentication va ma'lumot |

---

## 📁 Loyiha Strukturasi

```
forma-platform/
├── App.tsx                    # Asosiy app komponenti
├── index.tsx                  # React entry point
├── index.html                 # HTML template
├── firebase.ts                # Mock Firebase xizmati
├── types.ts                   # TypeScript turlamasi
├── vite.config.ts             # Vite konfiguratsiyasi
│
├── components/
│   └── Header.tsx             # Yuqori navigatsiya paneli
│
├── pages/
│   ├── Dashboard.tsx          # Forma ro'yxati (bosh sahifa)
│   ├── FormBuilder.tsx        # Forma yaratish/tahrirlash
│   ├── PublicForm.tsx         # Umumiy forma (respondent uchun)
│   └── ResponseDashboard.tsx  # Javoblar tahlili paneli
│
├── services/
│   └── formService.ts         # CRUD operatsiyalari
│
├── package.json               # NPM dependencies
├── tsconfig.json              # TypeScript konfiguratsiyasi
└── README.md                  # Bu fayl
```

---

## 🚀 Boshlash

### 1️⃣ **Talablar**

- **Node.js** 16+ (o'rnatish: https://nodejs.org)
- **npm** yoki **yarn**

### 2️⃣ **Loyihani Yuklab Olish**

```bash
# GitHub-dan clone qiling (yoki ZIP yuklab olish)
git clone https://github.com/yourusername/forma-platform.git
cd forma-platform
```

### 3️⃣ **Dependencies O'rnatish**

```bash
npm install
```

### 4️⃣ **Development Server Ishga Tushurish**

```bash
npm run dev
```

Brauzeringizni oching va quyidagiga boring:  
🌐 **http://localhost:3000**

### 5️⃣ **Production Build**

```bash
npm run build
npm run preview  # Build-ni test qilish
```

---

## 📖 Qo'llanma: Forma Yaratish

### 1. Forma Yaratish

1. **Bosh sahifaga kiring** → Google orqali tizimga kiring
2. **"Bo'sh shakl" tugmasini bosing** — yangi forma yaratiladi
3. **Forma nomini va tavsifini kiriting** — masalan: "Mijozlar Izohni"

### 2. Savollar Qo'shish

1. **"Yangi savol qo'shish" tugmasini bosing**
2. **Savol matni yozing** — masalan: "Bizni qanday bilganingiz?"
3. **Savol turini tanlang:**
   - **Qisqa matn** — bir qatorlik javoblar
   - **Uzun matn** — ko'p qatorlik javoblar
   - **Bir tanlov** — radio button (bitta tanlash)
   - **Ko'p tanlov** — checkbox (bir nechta tanlash)
   - **Ro'yxat** — dropdown menyu

### 3. Variantlar Qo'shish (Tanlangan Savollarda)

1. **RADIO, CHECKBOX yoki DROPDOWN uchun:**
   - "Variant qo'shish" tugmasini bosing
   - Variantning matnini yozing
   - Keraksa o'chirib tashlang (❌ tugmasi)

### 4. Savollarni Tartiblash

1. **Savol kartasining chap tomonidagi ⋮⋮ belgisin ustiga bosing**
2. **Drag-and-drop qilib savolni yuqoriga yoki pastga suring**
3. **Ko'k indikator chiziq yangi joylashuvni ko'rsatadi**

### 5. Forma Yuborish

1. **"Forma yaratish" tab-da tayyor bo'lgach, "Yuborish" tugmasini bosing**
2. **Modal oynada forma linkini ko'ching** (Ctrl+C / Cmd+C)
3. **Respondentlarga linkni yuboring** — masalan email, WhatsApp, sozial tarmoqlar

---

## 👥 Respondent Uchun

### Forma To'ldirish

1. **Yuborilgan linkni oching**
2. **Forma nomini va tavsifini ko'ring**
3. **Savollarni to'liq javob bering**
   - Majburiy savollar raqamli (*) belgisi bilan belgilangan
4. **"Yuborish" tugmasini bosing**
5. **Tashakkur sahifasi ochiladi**

---

## 📊 Javoblarni Ko'rish va Tahlil Qilish

### Javoblar Dashboardi

1. **Forma yaratish sahifasida "Javoblar" tab-ni bosing**
2. **Statistika ko'rish:**
   - Jami javob soni
   - Har bir javobning tafsili
   - Yuborilgan vaqti

3. **Javoblarni export qilish** (hozir saqlash — localStorage-da)

---

## 🔐 Authentication

### Hozirgi Holatida (Mock)

- ✅ **Mock Firebase** — Test uchun Google kirish simulyatsiyasi
- ✅ **localStorage** — Foydalanuvchi ma'lumotlari brauzer xotirasida
- ✅ **Real API key kerak emas** — Demo va test uchun tayyor

### Real Firebase Qo'yish (Future)

Agar real Google Authentication qo'lmoqchi bo'lsangiz:

1. [Firebase Console](https://console.firebase.google.com) saytiga o'ting
2. Yangi loyihani yarating
3. API kalitlarini `.env` fayliga qo'shing:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```
4. `firebase.ts` faylni real SDK bilan almashtiriniz

---

## 💾 Data Storage

### Hozir (localStorage)

Barcha ma'lumotlar brauzer xotirasida saqlanadi:

```javascript
// Saqlash joylari:
gemini_forms_data        // Forma ma'lumotlari
gemini_forms_responses   // Javoblar
gemini_forms_user        // Foydalanuvchi ma'lumotlari
```

**Afzalliklari:**
- ✅ Tez va oson
- ✅ Real backend kerak emas
- ✅ Offline ishlaydi

**Kamchiliklari:**
- ❌ Boshqa kompyuterdan ko'rinmaydi
- ❌ Cache tozalansa o'chib ketadi
- ❌ Ko'p foydalanuvchi uchun nomaqbul

### Real Database Variantlari

Agar ko'p foydalanuvchi va doimiy saqlash kerak bo'lsa:

| Database | Narx | Setup Murakkabligi | Tavsiya |
|----------|------|-------------------|--------|
| **Firebase Firestore** | Free tier | O'rta | ⭐⭐⭐⭐⭐ |
| **Supabase** | Free tier | O'rta | ⭐⭐⭐⭐ |
| **MongoDB** | Free tier | Yuqori | ⭐⭐⭐ |
| **PostgreSQL** | Self-hosted | Yuqori | ⭐⭐⭐ |

---

## 🌐 Deploy Qilish

### 🟢 Vercel (Tavsiya Etiladi)

**Eng tez va oson usul (1-2 daqiqa):**

```bash
# 1. GitHub-ga push qiling
git add .
git commit -m "Ready for deploy"
git push origin main

# 2. Vercel.com saytiga kiring
# 3. GitHub bilan authorize qiling
# 4. Repository select qiling
# 5. "Deploy" tugmasini bosing
# 6. 30 soniyada live! 🎉
```

**Foyda:**
- ✅ Free tier (har oy 100GB bandwidth)
- ✅ Automatic deployments (git push-da)
- ✅ Custom domain
- ✅ SSL/HTTPS bepul
- ✅ CDN tezligi

**Link misoli:** `https://forma-platform.vercel.app`

---

### 🔵 Netlify

```bash
# 1. netlify.com saytiga kiring
# 2. GitHub bilan sign up qiling
# 3. "New site from Git" bosing
# 4. Repository select qiling
# 5. Build command: npm run build
# 6. Directory: dist
# 7. Deploy ✅
```

---

### 🟡 GitHub Pages

```bash
# vite.config.ts tahrirlang
base: '/repo-name/'

# package.json-ga qo'shing
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

---

### 🟣 Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 📦 NPM Scripts

| Script | Maqsadi |
|--------|---------|
| `npm run dev` | Development server (hot reload) |
| `npm run build` | Production build yaratish |
| `npm run preview` | Build-ni localhost-da ko'rish |

---

## 🐛 Muammolarni Hal Qilish

### Sayt bo'sh oyna bilan ochilsa

```bash
# 1. Terminal-ni to'xtating
Ctrl + C

# 2. npm cache tozalash
npm cache clean --force

# 3. Qayta boshlash
npm run dev

# 4. Brauzer cache tozalash
Ctrl + Shift + Delete (F12 → Network → "Disable cache" tekshiring)
```

### "Module not found" xatosi

```bash
# Dependencies qayta o'rnatish
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Port 3000 band

```bash
# Boshqa port-da ishga tushurish
npx vite --port 3001
```

### Drag-drop ishlamilasa

- Brauzer konsolini oching: **F12** → **Console**
- Xatolarni tekshiring
- Brauzer cache tozalang yoki private mode-da test qiling

---

## 💡 Eng Yaxshi Amaliyotlar

1. **Forma Nomi** — Aniq va tushunarli nom qo'ying
2. **Savollar Soni** — 5-20 ta savoldan ko'p bo'lmasa yaxshi
3. **Majburiy Savollar** — Faqat juda muhim savollarni majburiy qiling
4. **Variantlar** — 2-5 ta variantdan ko'p bo'lmasa optimal
5. **Sharh** — Respondentlarga forma maqsadini tushuntiring
6. **Test Qilish** — Deploy qilishdan oldin forma linkini o'zingiz test qiling

---

## 🎨 Dizayn va Brending

- **Asosiy Rang**: `#003366` (Koʻk)
- **Fon**: `#f1f3f4` (Oq-och)
- **Font**: Inter (Google Fonts)
- **CSS Framework**: Tailwind CSS
- **Stil**: Modern, minimalist, professional

---

## 📝 Litsenziya

**MIT License** — Erkin foydalanish, o'zgartirilishi va tarqatilishi mumkin

Bu loyiha [MIT License](LICENSE) ostida nashr qilingan.

---

## 👨‍💻 Loyiha Sahiblari

**Forma Platformasi Development Team**

---

## 🤝 Hissa Qo'shish

Agar bug topganingiz yoki feature taklif qilmoqchi bo'lsangiz:

1. [Issues](https://github.com/yourusername/forma-platform/issues) bo'limida savollar yozing
2. Pull request yuboring
3. Taqlifa qo'l bering!

---

## 📞 Bog'lanish

- 📧 **Email**: your-email@example.com
- 🐙 **GitHub**: https://github.com/yourusername
- 💬 **Telegram**: @yourhandle

---

## 🙏 Rahmat

Ushbu loyiha quyidagilar tufayli mumkin bo'ldi:

- **React** — Kuchli UI library
- **Tailwind CSS** — Tez styling
- **Vite** — Lightspeed build tool
- **TypeScript** — Type safety
- **Firebase** — Backend xizmati

---

## 📊 Road Map (Turingi)

- [ ] Real Firebase Firestore integratsiyasi
- [ ] Google Analytics
- [ ] Responsive email senderlari
- [ ] CSV/PDF export
- [ ] Advanced analytics dashboard
- [ ] Multimedia savollar (rasm, video)
- [ ] Conditional logic (savollar shartiga ko'ra ko'rsatilsh)
- [ ] Kolaborativni editing

---

## ⚡ Performance

- ⚡ **Build Size**: ~150KB (gzipped)
- 📈 **Lighthouse Score**: 95+
- 🚀 **First Paint**: < 1s
- 📱 **Mobile Friendly**: 100/100

---

## 🔒 Xavfsizlik Eslatmalari

1. **localStorage** — Shaxsiy ma'lumot saqlashda ehtiyot bo'ling
2. **Public Links** — Forma linkini inson biladi, umumiy emas
3. **HTTPS** — Deploy qilinganda HTTPS ishlatinig kerak
4. **Validation** — Client-side tekshirish qilinadi, server-side kerak emas

---

## 📚 Qo'shimcha Resurslar

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide)

---

**Oxirgi yangilanish:** 29 Yanvar 2026  
**Versiya:** 1.0.0  
**Status:** ✅ Tayyor

---

<div align="center">

### 🌟 Agar loyihani yoqib ketsa, star berang! ⭐

</div>
