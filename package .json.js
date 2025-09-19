const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ضع مفتاح Stripe هنا أو متغير البيئة
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// مثال: إنشاء جلسة دفع Stripe
app.post("/create-checkout-session", async (req, res) => {
  const { price, userId } = req.body; // يمكن ربط الدفع بالمستخدم لاحقًا
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "شراء قناة / Premium" },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://telegram-hub-mini.vercel.app/success.html",
      cancel_url: "https://telegram-hub-mini.vercel.app/cancel.html",
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

