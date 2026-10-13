# Javohir — shaxsiy vizitka sayt

## Loyiha nima
- Javohirning shaxsiy sayti: fizika, matematika, mnemonika va C++ asoslari o'qituvchisi, 10 yillik tajriba.
- Kim uchun: o'quvchilar va ota-onalar, asosan telefondan kiradi.
- Maqsad: fanlar bilan tanishtirish va Telegram (@javohiriikromov) yoki telefon orqali darsga yozdirish.
- Netlify'da joylangan (Netlify Drop orqali qo'lda yuklanadi).

## Fayllar
- `index.html` — tuzilish va matnlar; `style.css` — dizayn; `script.js` — fon animatsiyasi, telefonlar karuseli, menyu.
- `images/javohir.webp` — hero rasmi.
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
