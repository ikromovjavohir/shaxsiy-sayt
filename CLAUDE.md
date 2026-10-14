# Javohir — shaxsiy vizitka sayt

## Loyiha nima
- Javohirning shaxsiy sayti: fizika, matematika, mnemonika va C++ asoslari o'qituvchisi, 10 yillik tajriba.
- Kim uchun: o'quvchilar va ota-onalar, asosan telefondan kiradi.
- Maqsad: fanlar bilan tanishtirish va Telegram (@javohiriikromov) yoki telefon orqali darsga yozdirish.
- Netlify'da joylangan (Netlify Drop orqali qo'lda yuklanadi) va GitHub Pages'da: https://ikromovjavohir.github.io/shaxsiy-sayt/ (`main` ga push qilinganda o'zi yangilanadi).

## Fayllar
- `index.html` — tuzilish va matnlar; `style.css` — dizayn; `script.js` — fon animatsiyasi, telefonlar karuseli, menyu.
- `images/hero.jpg` — hero rasmi (`images/javohir.webp` — eski rasm, ishlatilmaydi).
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` — ikonkalar; `og-image.jpg` (1200x630) — havola kartasi rasmi.
- Sayt manzili o'zgarsa: `index.html` dagi `og:url` va `og:image` manzillarini ham almashtirish kerak.
- Bo'limlar: hero, men haqimda, fanlar, xizmatlar, ishlarim, fikrlar, savol-javob (+ savol formasi), aloqa.
- Savol formasi Netlify Forms orqali ishlaydi (lokal serverda yuborilmaydi — bu normal).

## Uslub
- Ranglar `style.css` boshidagi `:root` o'zgaruvchilarida: to'q ko'k fon, firuza (`--accent`), iliq oltin (`--warm`).
- Shriftlar: Manrope (asosiy), Playfair Display kursiv (sarlavhadagi urg'uli so'z).
- Ohang: iliq, samimiy, ishonchli; matnlar o'zbek tilida (lotin).
- O'ylab topilgan raqam yoki da'volar yozilmaydi (masalan "500+ o'quvchi").

## Texnik chegaralar
- Faqat oddiy HTML, CSS va JS — kutubxona, framework yoki build yo'q.
- Har o'zgarishdan keyin telefon (320–414px) va kompyuterda tekshirish: yonga surilmasin, telefon kartalaridagi matn kesilmasin.
- Telefon uchun CSS qoidalari fayl oxirida turadi (aks holda asosiy qoidalar ularni bekor qiladi).

## Ish qoidalari
- Qurishdan oldin qisqa reja ko'rsatish, keyin kichik qadamlar bilan ishlash.
- Javoblar o'zbek tilida, oddiy so'zlar bilan.
- Parol, kalit yoki tokenlarni hech qachon faylga yozmaslik.
