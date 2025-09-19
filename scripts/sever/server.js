const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Stripe = require("stripe");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

let ads = [
  { id: 1, type: "gold", title: "إعلان ذهبي", content: "مثال لإعلان ذهبي" },
  { id: 2, type: "silver", title: "إعلان فضي", content: "مثال لإعلان فضي" }
];

app.get("/ads", (req, res) => res.json(ads));

app.post("/ads", (req, res) => {
  const { type, title, content } = req.body;
  const id = ads.length ? ads[ads.length - 1].id + 1 : 1;
  ads.push({ id, type, title, content });
  res.json({ success: true, id });
});

app.delete("/ads/:id", (req, res) => {
  const id = parseInt(req.params.id);
  ads = ads.filter(ad => ad.id !== id);
  res.json({ success: true });
});

app.post("/create-checkout-session", async (req, res) => {
  const { plan } = req.body;
  const priceId =
    plan === "gold" ? process.env.STRIPE_PRICE_GOLD : process.env.STRIPE_PRICE_SILVER;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/index.html?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/index.html?canceled=true`
  });

  res.json({ url: session.url });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
