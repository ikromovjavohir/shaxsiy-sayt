// Fondagi tarmoq animatsiyasi
const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");
let points = [];

function setup() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const count = Math.min(90, Math.floor(innerWidth * innerHeight / 14000));
  points = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of points) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  }
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i], b = points[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 160) {
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.35 * (1 - d / 160)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  }
  for (const p of points) {
    ctx.fillStyle = "rgba(103, 232, 249, 0.9)";
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.shadowBlur = 0;
  requestAnimationFrame(draw);
}

// Telefonda sahifa aylantirilganda manzil qatori yashirinib, oyna bo'yi o'zgaradi.
// Shunda nuqtalarni qaytadan yaratmaymiz — faqat eni o'zgarsa yaratamiz.
let lastWidth = innerWidth;
addEventListener("resize", () => {
  if (innerWidth !== lastWidth) {
    lastWidth = innerWidth;
    setup();
  } else {
    canvas.height = innerHeight;
  }
});
setup();
draw();

// Telefonlar karuseli: markazdagi telefon katta, ekrani birin-ketin "yonadi"
const phones = [...document.querySelectorAll(".phone")];
const slider = document.querySelector(".slider");
const dotsBox = document.querySelector(".dots");
let active = 0;
let paused = false;
let tabTimer;

// "Imkoniyatlar | Natija" almashtirgichi
function setTab(phone, index) {
  phone.querySelectorAll(".tab").forEach((t, i) => t.classList.toggle("on", i === index));
  phone.querySelectorAll(".pane").forEach((p, i) => p.classList.toggle("on", i === index));
}

// Har bir telefon uchun nuqta
const dots = phones.map((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("aria-label", `${i + 1}-fan`);
  b.addEventListener("click", () => show(i));
  dotsBox.appendChild(b);
  return b;
});

function show(index) {
  const n = phones.length;
  active = (index + n) % n;

  phones.forEach((phone, i) => {
    // -1 = chapda, 0 = markazda, 1 = o'ngda, 2 = yashirin
    const pos = ((i - active + n + 1) % n) - 1;
    const old = Number(phone.dataset.pos);

    // Bir chetdan ikkinchi chetga o'tayotgan telefon ko'rinmasdan "sakraydi"
    phone.style.transition = Math.abs(pos - old) > 1 ? "none" : "";
    phone.dataset.pos = pos;

    // Markazga kelgan telefonda animatsiyani qaytadan boshlash
    phone.classList.remove("play");
    setTab(phone, 0);
    if (pos === 0) {
      phone.offsetWidth; // animatsiyani qayta ishga tushirish uchun
      phone.classList.add("play");
      // biroz o'tib o'zi "Natija"ga o'tadi
      clearTimeout(tabTimer);
      tabTimer = setTimeout(() => setTab(phone, 1), 3200);
    }
  });

  dots.forEach((d, i) => d.classList.toggle("on", i === active));
}

phones.forEach((phone, i) => {
  // Yon telefonni bosganda o'sha markazga keladi (ichidagi tugma ishlamaydi)
  phone.addEventListener("click", (e) => {
    if (phone.dataset.pos !== "0") {
      e.preventDefault();
      show(i);
    }
  });

  // Markazdagi telefonda tablarni qo'lda almashtirish
  phone.querySelectorAll(".tab").forEach((tab, t) =>
    tab.addEventListener("click", () => {
      if (phone.dataset.pos !== "0") return;
      clearTimeout(tabTimer);
      setTab(phone, t);
    })
  );
});

// Kompyuterda: sichqoncha ustida bo'lsa to'xtaydi
// (telefonda tegish "mouseenter" ham chiqaradi va aylanish to'xtab qolardi — shuning uchun faqat sichqoncha)
slider.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") paused = true; });
slider.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") paused = false; });

// Karusel balandligi eng uzun telefonga moslashadi (tor ekranda telefon bo'yiga o'sishi mumkin)
function fitSlider() {
  const tallest = Math.max(...phones.map((p) => p.offsetHeight));
  slider.style.height = tallest + 120 + "px";
}
addEventListener("resize", fitSlider);
document.fonts && document.fonts.ready.then(fitSlider);
fitSlider();

// Telefonda: barmoq bilan chapga/o'ngga surish
let startX = 0;
slider.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  paused = true;
}, { passive: true });

slider.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if (dx < -40) show(active + 1);
  if (dx > 40) show(active - 1);
  setTimeout(() => (paused = false), 5000);
});

show(0);
setInterval(() => { if (!paused) show(active + 1); }, 6500);

// Menyuda hozir ko'rinib turgan bo'limni ajratib ko'rsatish
const navLinks = [...document.querySelectorAll(".links a")];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href")));

function markActive() {
  const y = innerHeight * 0.4;
  let current = null;
  sections.forEach((sec, i) => {
    if (sec.getBoundingClientRect().top <= y) current = i;
  });
  // sahifa oxiriga yetilganda oxirgi bo'lim (Aloqa) belgilanadi
  if (scrollY > 0 && innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = sections.length - 1;
  navLinks.forEach((a, i) => a.classList.toggle("active", i === current));
}

addEventListener("scroll", markActive, { passive: true });
addEventListener("load", markActive); // sahifa to'liq yuklangach yana bir bor
markActive();

// Telefon menyusi: ☰ tugmasi bilan ochish/yopish
const nav = document.querySelector(".nav");
const menuBtn = document.querySelector(".menu-btn");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
}

menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
navLinks.forEach((a) => a.addEventListener("click", () => setMenu(false)));   // bo'limga o'tganda yopiladi
document.addEventListener("click", (e) => { if (!nav.contains(e.target)) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Savol formasi: Telegram'da men bilan chat ochiladi, savol matni tayyor yozilgan bo'ladi.
// (GitHub Pages server qismini qo'llamaydi, shuning uchun xabar Telegram orqali boradi.)
const askForm = document.querySelector(".ask");
const askStatus = askForm.querySelector(".ask-status");
const TELEGRAM = "javohiriikromov";

askForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(askForm);
  const text = [
    "Assalomu alaykum! Saytingizdan yozyapman.",
    "Ismim: " + data.get("ism").trim(),
    "Aloqa: " + data.get("aloqa").trim(),
    "Savolim: " + data.get("savol").trim()
  ].join("\n");

  // zaxira: agar Telegram matnni o'zi qo'ymasa, foydalanuvchi uni joylashtira oladi
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});

  const url = "https://t.me/" + TELEGRAM + "?text=" + encodeURIComponent(text);
  const win = window.open(url, "_blank");
  if (win) win.opener = null;     // xavfsizlik: ochilgan sahifa saytimizni boshqara olmasin
  else location.href = url;       // brauzer yangi oynani bloklasa — shu oynada ochamiz

  askStatus.className = "ask-status ok";
  askStatus.textContent =
    "Telegram ochildi — xabarni yuboring. Matn chiqmasa, u nusxalangan: chatga joylashtiring.";
});

// ===== Yengil jonlanish =====
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1) Scroll qilganda bo'limlar pastdan ko'tarilib chiqadi (har biri faqat bir marta)
document.documentElement.classList.add("js");

const revealSingles = [
  ".eyebrow", "section h2:not(.service-title)", ".section-lead",
  ".about-card", ".slider", ".service-inner", ".ask",
  ".contact .buttons", ".contact .note"
];
const revealGroups = [".facts li", ".work", ".review", ".faq details"]; // ketma-ket chiqadi

document.querySelectorAll(revealSingles.join(",")).forEach((el) => el.classList.add("reveal"));
revealGroups.forEach((sel) => {
  document.querySelectorAll(sel).forEach((el) => {
    const index = [...el.parentElement.children].indexOf(el);
    el.style.setProperty("--d", `${index * 0.08}s`);
    el.classList.add("reveal");
  });
});

// Ekran pastki chizig'idan yuqoriga chiqqan har bir element ko'rsatiladi.
// (Tez aylantirilganda yoki menyu orqali sakralganda ham hech biri yashirin qolib ketmaydi.)
let pending = [...document.querySelectorAll(".reveal")];
let ticking = false;

function revealVisible() {
  ticking = false;
  const line = innerHeight * 0.92;
  pending = pending.filter((el) => {
    if (el.getBoundingClientRect().top < line) {
      el.classList.add("in");
      return false;
    }
    return true;
  });
  if (!pending.length) removeEventListener("scroll", onRevealScroll);
}

function onRevealScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(revealVisible);
  }
}

addEventListener("scroll", onRevealScroll, { passive: true });
addEventListener("resize", onRevealScroll);
revealVisible();

// 3) Savol-javob akkordeoni: silliq ochiladi/yopiladi, bir vaqtda faqat bittasi ochiq
const faqItems = [...document.querySelectorAll(".faq details")];

function openFaq(d) {
  d.open = true;
  if (reduceMotion) return;
  const p = d.querySelector("p");
  const pad = getComputedStyle(p).paddingBottom;
  p.animate(
    [{ height: "0px", paddingBottom: "0px", opacity: 0 }, { height: p.offsetHeight + "px", paddingBottom: pad, opacity: 1 }],
    { duration: 250, easing: "ease-out" }
  );
}

function closeFaq(d) {
  if (reduceMotion) { d.open = false; return; }
  const p = d.querySelector("p");
  const anim = p.animate(
    [{ height: p.offsetHeight + "px", opacity: 1 }, { height: "0px", paddingBottom: "0px", opacity: 0 }],
    { duration: 200, easing: "ease-in" }
  );
  anim.onfinish = () => (d.open = false);
}

faqItems.forEach((d) => {
  d.querySelector("summary").addEventListener("click", (e) => {
    e.preventDefault();
    if (d.open) {
      closeFaq(d);
    } else {
      faqItems.filter((o) => o !== d && o.open).forEach(closeFaq);
      openFaq(d);
    }
  });
});
