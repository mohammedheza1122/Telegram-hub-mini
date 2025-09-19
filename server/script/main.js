// =============================
// Telegram Hub Mini - Frontend
// =============================

// عنوان الـBackend (عدّل حسب رابط النشر على Render/Heroku)
const API_BASE = "https://your-backend.onrender.com";

// =============================
// جلب الإعلانات وعرضها
// =============================
async function loadAds() {
  try {
    const res = await fetch(`${API_BASE}/ads`);
    const ads = await res.json();

    const adsContainer = document.getElementById("ads-container");
    if (!adsContainer) return;

    adsContainer.innerHTML = "";

    ads.forEach((ad) => {
      const adCard = document.createElement("div");
      adCard.classList.add("ad-card", ad.type); // إضافة CSS حسب نوع الإعلان

      adCard.innerHTML = `
        <h3>${ad.title}</h3>
        <p>${ad.content}</p>
      `;

      adsContainer.appendChild(adCard);
    });
  } catch (err) {
    console.error("❌ خطأ عند تحميل الإعلانات:", err);
  }
}

// =============================
// بدء عملية الدفع عبر Stripe
// =============================
async function startCheckout(plan) {
  try {
    const res = await fetch(`${API_BASE}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan })
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // تحويل المستخدم إلى Stripe Checkout
    } else {
      alert("حدث خطأ أثناء معالجة الدفع ❌");
    }
  } catch (err) {
    console.error("❌ خطأ Stripe:", err);
  }
}

// =============================
// تهيئة الصفحة
// =============================
document.addEventListener("DOMContentLoaded", () => {
  // تحميل الإعلانات تلقائيًا
  loadAds();

  // ربط أزرار الدفع بخطط Stripe
  const goldBtn = document.getElementById("buy-gold");
  const silverBtn = document.getElementById("buy-silver");

  if (goldBtn) goldBtn.addEventListener("click", () => startCheckout("gold"));
  if (silverBtn) silverBtn.addEventListener("click", () => startCheckout("silver"));
});
