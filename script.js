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
  navLinks.forEach((a, i) => a.classList.toggle("active", i === current));
}

addEventListener("scroll", markActive, { passive: true });
markActive();
