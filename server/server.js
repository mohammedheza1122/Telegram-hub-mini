// =============================
// Telegram Hub Mini - Backend
// =============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

// تحميل متغيرات البيئة
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// =============================
// نقطة اختبار
// =============================
app.get("/", (req, res) => {
  res.send("✅ Telegram Hub Mini Backend يعمل بشكل صحيح!");
});

// =============================
// API - Stripe Checkout
// =============================
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan } = req.body;

    let priceId;
    if (plan === "gold") {
      priceId = process.env.STRIPE_PRICE_GOLD;
    } else if (plan === "silver") {
      priceId = process.env.STRIPE_PRICE_SILVER;
    } else {
      return res.status(400).json({ error: "الخطة غير صحيحة" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ خطأ Stripe:", err.message);
    res.status(500).json({ error: "خطأ في Stripe" });
  }
});

// =============================
// API - إدارة الإعلانات
// =============================
let ads = [
  { id: 1, type: "gold", title: "إعلان ذهبي تجريبي", content: "هذا إعلان مميز يظهر في الأعلى" },
  { id: 2, type: "silver", title: "إعلان فضي تجريبي", content: "هذا إعلان يظهر في المنتصف" }
];

// إرجاع جميع الإعلانات
app.get("/ads", (req, res) => {
  res.json(ads);
});

// إضافة إعلان جديد
app.post("/ads", (req, res) => {
  const { type, title, content } = req.body;
  const newAd = {
    id: ads.length + 1,
    type,
    title,
    content
  };
  ads.push(newAd);
  res.json(newAd);
});

// حذف إعلان
app.delete("/ads/:id", (req, res) => {
  const adId = parseInt(req.params.id, 10);
  ads = ads.filter((ad) => ad.id !== adId);
  res.json({ success: true });
});

// =============================
// تشغيل السيرفر
// =============================
app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال على المنفذ ${PORT}`);
});
