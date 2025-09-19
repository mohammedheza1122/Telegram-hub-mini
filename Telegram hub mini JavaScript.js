
.card.premium {
  border: 2px solid gold;
  box-shadow: 0 0 10px rgba(255,215,0,0.5);
}

/* بطاقات Boosted */
.card.boosted {
  border: 2px solid #00ffcc;
  box-shadow: 0 0 10px rgba(0,255,204,0.5);
}

/* إشعارات داخل التطبيق */
.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #0088cc;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.5s;
  z-index: 1000;
}
// --- الاشتراكات Premium / Boost ---
function subscribePremium(userId) {
  // إرسال طلب للـ Bot لتفعيل الاشتراك
  tg.sendData(JSON.stringify({ type: "subscribe_premium", userId }));
  showNotification("تم تفعيل اشتراك Premium بنجاح!");
}

function boostChannel(channelName) {
  tg.sendData(JSON.stringify({ type: "boost_channel", name: channelName }));
  showNotification(`تم تفعيل Boost للقناة "${channelName}"`);
}

// مثال زر تفعيل الاشتراك للمستخدم
// يمكن ربطه بواجهة المستخدم لاحقًا
const premiumBtn = document.getElementById("premium-btn");
if(premiumBtn){
  premiumBtn.addEventListener("click", () => {
    const userId = tg.initDataUnsafe.user.id;
    subscribePremium(userId);
  });
}

// مثال زر Boost للقنوات
document.querySelectorAll(".boost-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const channelName = btn.getAttribute("data-channel");
    boostChannel(channelName);
  });
});

// --- عرض الإعلانات المدفوعة ---
function displayAds(ads) {
  // ads = مصفوفة تحتوي على: { title, image, link }
  const adContainer = document.querySelector(".ads-container");
  if(!adContainer) return;

  ads.forEach(ad => {
    const adCard = document.createElement("div");
    adCard.classList.add("card", "ad-card");
    adCard.innerHTML = `
      <img src="${ad.image}" alt="${ad.title}">
      <h3>${ad.title}</h3>
      <button onclick="window.open('${ad.link}', '_blank')">عرض الإعلان</button>
    `;
    adContainer.appendChild(adCard);
  });
}

// --- مثال بيانات إعلانية ---
const ads = [
  { title: "اعلان مميز 1", image: "https://via.placeholder.com/100", link: "https://t.me" },
  { title: "اعلان مميز 2", image: "https://via.placeholder.com/100", link: "https://t.me" }
];

displayAds(ads);
// --- Telegram WebApp ---
const tg = window.Telegram.WebApp;
tg.expand();
console.log("Telegram Hub Mini – Full Version Loaded!");

// --- التنقل بين الصفحات ---
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-page");
    pages.forEach(page => {
      page.classList.toggle("active", page.id === target);
    });
  });
});

// --- إشعارات داخل التطبيق ---
function showNotification(message, type = "info") {
  const notif = document.createElement("div");
  notif.classList.add("notification", type);
  notif.textContent = message;
  document.body.appendChild(notif);
  notif.style.opacity = 1;

  setTimeout(() => {
    notif.style.opacity = 0;
    setTimeout(() => notif.remove(), 500);
  }, 2500);
}

// --- نموذج منشورات المستخدم ---
const postBtn = document.getElementById("post-btn");
const postInput = document.getElementById("post-input");
const postsContainer = document.querySelector(".posts-container");

postBtn.addEventListener("click", () => {
  const content = postInput.value.trim();
  if (!content) return alert("يرجى كتابة منشور قبل النشر.");

  const postCard = document.createElement("div");
  postCard.classList.add("post-card");
  postCard.innerHTML = `<p>${content}</p>`;
  postsContainer.prepend(postCard);

  // إرسال المنشور للبوت
  tg.sendData(JSON.stringify({ type: "new_post", content }));

  postInput.value = "";
  showNotification("تم نشر منشورك بنجاح!", "success");
});

// --- إدارة السوق والقنوات مع AI + Premium + Boost ---
const marketContainer = document.querySelector(".cards-container");

// مثال بيانات القنوات
const channels = [
  { name: "قناة ترفيهية", subscribers: 12500, rating: 4.5, premium: true, boosted: false },
  { name: "قناة تعليمية", subscribers: 8300, rating: 4.7, premium: false, boosted: true },
  { name: "قناة أخبارية", subscribers: 15600, rating: 4.2, premium: false, boosted: false }
];

// دالة محاكاة AI لتسعير القناة
function aiPricing(channel) {
  let basePrice = channel.subscribers * 0.02;
  let ratingMultiplier = channel.rating / 5;
  let premiumBonus = channel.premium ? 1.3 : 1;
  let boostedBonus = channel.boosted ? 1.2 : 1;
  return Math.round(basePrice * ratingMultiplier * premiumBonus * boostedBonus);
}

// عرض القنوات
channels.forEach(channel => {
  const card = document.createElement("div");
  card.classList.add("card");
  if(channel.premium) card.classList.add("premium");
  if(channel.boosted) card.classList.add("boosted");

  const price = aiPricing(channel);

  card.innerHTML = `
    <img src="https://via.placeholder.com/100" alt="${channel.name}">
    <h3>${channel.name}</h3>
    <p>عدد المشتركين: ${channel.subscribers.toLocaleString()}</p>
    <p>تقييم AI: ${channel.rating}/5</p>
    <p>السعر المقدر: ${price}$</p>
    <button class="buy-btn">شراء / تفاوض</button>
    <button class="boost-btn" data-channel="${channel.name}">تفعيل Boost</button>
  `;

  // شراء القناة + دفع عبر Telegram Payments
  card.querySelector(".buy-btn").addEventListener("click", () => {
    tg.sendData(JSON.stringify({ type: "buy_channel", name: channel.name, price }));
    showNotification(`تم إرسال طلب شراء القناة "${channel.name}"`);
    // هنا يمكن ربط tg.sendInvoice للمعاملات المالية
  });

  // Boost القناة
  card.querySelector(".boost-btn").addEventListener("click", () => {
    tg.sendData(JSON.stringify({ type: "boost_channel", name: channel.name }));
    showNotification(`تم تفعيل Boost للقناة "${channel.name}"`);
  });

  marketContainer.appendChild(card);
});

// --- نظام Premium للمستخدم ---
const premiumBtn = document.getElementById("premium-btn");
if(premiumBtn){
  premiumBtn.addEventListener("click", () => {
    const userId = tg.initDataUnsafe.user.id;
    tg.sendData(JSON.stringify({ type: "subscribe_premium", userId }));
    showNotification("تم تفعيل اشتراك Premium بنجاح!");
    // يمكن ربط tg.sendInvoice هنا لدفع الاشتراك
  });
}

// --- الإعلانات المدفوعة ---
function displayAds(ads) {
  const adContainer = document.querySelector(".ads-container");
  if(!adContainer) return;

  ads.forEach(ad => {
    const adCard = document.createElement("div");
    adCard.classList.add("card", "ad-card");
    adCard.innerHTML = `
      <img src="${ad.image}" alt="${ad.title}">
      <h3>${ad.title}</h3>
      <button onclick="window.open('${ad.link}', '_blank')">عرض الإعلان</button>
    `;
    adContainer.appendChild(adCard);
  });
}

// مثال إعلانات
const ads = [
  { title: "اعلان مميز 1", image: "https://via.placeholder.com/100", link: "https://t.me" },
  { title: "اعلان مميز 2", image: "https://via.placeholder.com/100", link: "https://t.me" }
];

displayAds(ads);
function payPremium(userId) {
  // إعداد بيانات الفاتورة
  const invoice = {
    chat_id: userId,
    title: "اشتراك Premium",
    description: "تفعيل مزايا Premium في Telegram Hub Mini لمدة شهر",
    payload: "premium_subscription_001",
    provider_token: "YOUR_PROVIDER_TOKEN",
    currency: "USD",
    prices: [{ label: "اشتراك Premium", amount: 5000 }] // 50.00 USD (amount بالـ سنت)
  };

  // إرسال الفاتورة عبر Bot API
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendInvoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invoice)
  })
  .then(res => res.json())
  .then(data => console.log("Invoice sent:", data))
  .catch(err => console.error(err));
}
function payForChannel(userId, channelName, priceUSD) {
  const invoice = {
    chat_id: userId,
    title: `شراء قناة: ${channelName}`,
    description: `إتمام شراء القناة ${channelName} بسعر ${priceUSD} USD`,
    payload: `buy_channel_${channelName}`,
    provider_token: "YOUR_PROVIDER_TOKEN",
    currency: "USD",
    prices: [{ label: `سعر القناة ${channelName}`, amount: priceUSD * 100 }]
  };

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendInvoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invoice)
  })
  .then(res => res.json())
  .then(data => console.log("Invoice sent:", data))
  .catch(err => console.error(err));
}
function handleSuccessfulPayment(data) {
  const { user_id, payload } = data;
  if(payload.startsWith("premium_subscription")) {
    // تفعيل Premium
    tg.sendData(JSON.stringify({ type: "premium_activated", userId: user_id }));
  } else if(payload.startsWith("buy_channel")) {
    // تأكيد شراء القناة
    const channelName = payload.replace("buy_channel_", "");
    tg.sendData(JSON.stringify({ type: "channel_bought", name: channelName }));
  }
}
premiumBtn.addEventListener("click", () => {
  const userId = tg.initDataUnsafe.user.id;
  payPremium(userId); // إرسال فاتورة Premium
});

document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const userId = tg.initDataUnsafe.user.id;
    const channelName = btn.getAttribute("data-channel");
    const price = parseInt(btn.getAttribute("data-price"));
    payForChannel(userId, channelName, price);
  });
});

const tg = window.Telegram.WebApp;
tg.expand();
console.log("Telegram Hub Mini – Full Version Loaded!");

// التنقل بين الصفحات
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");
navButtons.forEach(btn => btn.addEventListener("click", () => {
  const target = btn.getAttribute("data-page");
  pages.forEach(p => p.classList.toggle("active", p.id === target));
}));

// إشعارات
function showNotification(message, type="info"){
  const notif = document.createElement("div");
  notif.classList.add("notification", type);
  notif.textContent = message;
  document.body.appendChild(notif);
  notif.style.opacity = 1;
  setTimeout(()=>{ notif.style.opacity=0; setTimeout(()=>notif.remove(),500); },2500);
}

// منشورات المستخدم
const postBtn=document.getElementById("post-btn");
const postInput=document.getElementById("post-input");
const postsContainer=document.querySelector(".posts-container");
postBtn.addEventListener("click",()=>{
  const content=postInput.value.trim();
  if(!content) return alert("يرجى كتابة منشور قبل النشر.");
  const postCard=document.createElement("div");
  postCard.classList.add("post-card");
  postCard.innerHTML=`<p>${content}</p>`;
  postsContainer.prepend(postCard);
  tg.sendData(JSON.stringify({type:"new_post",content}));
  postInput.value="";
  showNotification("تم نشر منشورك بنجاح!","success");
});

// القنوات في السوق
const marketContainer=document.querySelector(".cards-container");
const channels=[
  {name:"قناة ترفيهية",subscribers:12500,rating:4.5,premium:true,boosted:false},
  {name:"قناة تعليمية",subscribers:8300,rating:4.7,premium:false,boosted:true},
  {name:"قناة أخبارية",subscribers:15600,rating:4.2,premium:false,boosted:false}
];
function aiPricing(channel){
  let basePrice=channel.subscribers*0.02;
  let ratingMultiplier=channel.rating/5;
  let premiumBonus=channel.premium?1.3:1;
  let boostedBonus=channel.boosted?1.2:1;
  return Math.round(basePrice*ratingMultiplier*premiumBonus*boostedBonus);
}
channels.forEach(channel=>{
  const card=document.createElement("div");
  card.classList.add("card");
  if(channel.premium) card.classList.add("premium");
  if(channel.boosted) card.classList.add("boosted");
  const price=aiPricing(channel);
  card.setAttribute("data-price",price);
  card.setAttribute("data-channel",channel.name);
  card.innerHTML=`
    <img src="https://via.placeholder.com/100" alt="${channel.name}">
    <h3>${channel.name}</h3>
    <p>عدد المشتركين: ${channel.subscribers.toLocaleString()}</p>
    <p>تقييم AI: ${channel.rating}/5</p>
    <p>السعر المقدر: ${price}$</p>
    <button class="buy-btn">شراء / تفاوض</button>
    <button class="boost-btn" data-channel="${channel.name}">تفعيل Boost</button>
  `;
  card.querySelector(".buy-btn").addEventListener("click",()=>{
    const userId=tg.initDataUnsafe.user.id;
    const price=parseInt(card.getAttribute("data-price"));
    const channelName=card.getAttribute("data-channel");
    tg.sendData(JSON.stringify({type:"buy_channel",name:channelName,price}));
    showNotification(`تم إرسال طلب شراء القناة "${channelName}"`);
  });
  card.querySelector(".boost-btn").addEventListener("click",()=>{
    const channelName=card.getAttribute("data-channel");
    tg.sendData(JSON.stringify({type:"boost_channel",name:channelName}));
    showNotification(`تم تفعيل Boost للقناة "${channelName}"`);
  });
  marketContainer.appendChild(card);
});

// Premium
const premiumBtn=document.getElementById("premium-btn");
if(premiumBtn){
  premiumBtn.addEventListener("click",()=>{
    const userId=tg.initDataUnsafe.user.id;
    tg.sendData(JSON.stringify({type:"subscribe_premium",userId}));
    showNotification("تم تفعيل اشتراك Premium بنجاح!");
  });
}

// الإعلانات
function displayAds(ads){
  const adContainer=document.querySelector(".ads-container");
  if(!adContainer) return;
  ads.forEach(ad=>{
    const adCard=document.createElement("div");
    adCard.classList.add("card","ad-card");
    adCard.innerHTML=`
      <img src="${ad.image}" alt="${ad.title}">
      <h3>${ad.title}</h3>
      <button onclick="window.open('${ad.link}','_blank')">عرض الإعلان</button>
    `;
    adContainer.appendChild(adCard);
  });
}
const ads=[
  {title:"اعلان مميز 1",image:"https://via.placeholder.com/100",link:"https://t.me"},
  {title:"اعلان مميز 2",image:"https://via.placeholder.com/100",link:"https://t.me"}
];
displayAds(ads);
// === Telegram Hub Mini Script ===
const tg = window.Telegram.WebApp;
tg.expand();
console.log("Telegram Hub Mini Loaded!");

// === التنقل بين الصفحات ===
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");
navButtons.forEach(btn =>
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-page");
    pages.forEach(p => p.classList.toggle("active", p.id === target));
  })
);

// === إشعارات ===
function showNotification(msg, type = "info") {
  const notif = document.createElement("div");
  notif.classList.add("notification", type);
  notif.textContent = msg;
  document.body.appendChild(notif);
  notif.style.opacity = 1;
  setTimeout(() => {
    notif.style.opacity = 0;
    setTimeout(() => notif.remove(), 500);
  }, 2500);
}

// === منشورات المستخدم ===
const postBtn = document.getElementById("post-btn");
const postInput = document.getElementById("post-input");
const postsContainer = document.querySelector(".posts-container");
postBtn.addEventListener("click", () => {
  const content = postInput.value.trim();
  if (!content) return alert("يرجى كتابة منشور قبل النشر.");
  const postCard = document.createElement("div");
  postCard.classList.add("post-card");
  postCard.innerHTML = `<p>${content}</p>`;
  postsContainer.prepend(postCard);
  tg.sendData(JSON.stringify({ type: "new_post", content }));
  postInput.value = "";
  showNotification("تم نشر منشورك بنجاح!", "success");
});

// === السوق والقنوات ===
const marketContainer = document.querySelector(".cards-container");
const channels = [
  { name: "قناة ترفيهية", subscribers: 12500, rating: 4.5, premium: true, boosted: false },
  { name: "قناة تعليمية", subscribers: 8300, rating: 4.7, premium: false, boosted: true },
  { name: "قناة أخبارية", subscribers: 15600, rating: 4.2, premium: false, boosted: false }
];

function aiPricing(channel) {
  let base = channel.subscribers * 0.02;
  let multiplier = channel.rating / 5;
  let premium = channel.premium ? 1.3 : 1;
  let boosted = channel.boosted ? 1.2 : 1;
  return Math.round(base * multiplier * premium * boosted);
}

channels.forEach(channel => {
  const card = document.createElement("div");
  card.classList.add("card");
  if (channel.premium) card.classList.add("premium");
  if (channel.boosted) card.classList.add("boosted");
  const price = aiPricing(channel);
  card.setAttribute("data-price", price);
  card.setAttribute("data-channel", channel.name);
  card.innerHTML = `
    <img src="https://via.placeholder.com/100" alt="${channel.name}">
    <h3>${channel.name}</h3>
    <p>عدد المشتركين: ${channel.subscribers.toLocaleString()}</p>
    <p>تقييم AI: ${channel.rating}/5</p>
    <p>السعر المقدر: ${price}$</p>
    <button class="buy-btn">شراء / تفاوض</button>
    <button class="boost-btn" data-channel="${channel.name}">تفعيل Boost</button>
  `;

  card.querySelector(".buy-btn").addEventListener("click", () => {
    const userId = tg.initDataUnsafe.user.id;
    const channelName = card.getAttribute("data-channel");
    const price = parseInt(card.getAttribute("data-price"));
    tg.sendData(JSON.stringify({ type: "buy_channel", name: channelName, price }));
    showNotification(`تم إرسال طلب شراء القناة "${channelName}"`);
  });

  card.querySelector(".boost-btn").addEventListener("click", () => {
    const channelName = card.getAttribute("data-channel");
    tg.sendData(JSON.stringify({ type: "boost_channel", name: channelName }));
    showNotification(`تم تفعيل Boost للقناة "${channelName}"`);
  });

  marketContainer.appendChild(card);
});

// === Premium للمستخدم ===
const premiumBtn = document.getElementById("premium-btn");
if (premiumBtn) {
  premiumBtn.addEventListener("click", () => {
    const userId = tg.initDataUnsafe.user.id;
    tg.sendData(JSON.stringify({ type: "subscribe_premium", userId }));
    showNotification("تم تفعيل اشتراك Premium بنجاح!");
  });
}

// === الإعلانات المدفوعة ===
function displayAds(ads) {
  const adContainer = document.querySelector(".ads-container");
  if (!adContainer) return;
  ads.forEach(ad => {
    const adCard = document.createElement("div");
    adCard.classList.add("card", "ad-card");
    adCard.innerHTML = `
      <img src="${ad.image}" alt="${ad.title}">
      <h3>${ad.title}</h3>
      <button onclick="window.open('${ad.link}','_blank')">عرض الإعلان</button>
    `;
    adContainer.appendChild(adCard);
  });
}

const ads = [
  { title: "اعلان مميز 1", image: "https://via.placeholder.com/100", link: "https://t.me" },
  { title: "اعلان مميز 2", image: "https://via.placeholder.com/100", link: "https://t.me" }
];
displayAds(ads);
// Navbar
document.getElementById("navbar").innerHTML = `
  <button class="nav-btn" data-page="home">الرئيسية</button>
  <button class="nav-btn" data-page="market">السوق</button>
  <button class="nav-btn" data-page="profile">ملفي</button>
  <button class="nav-btn" data-page="admin">الإدارة</button>
`;
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    const page = document.getElementById(btn.getAttribute("data-page"));
    if(page) page.classList.add("active");
  });
});

// إشعارات
function showNotification(msg,type="info"){
  const n = document.createElement("div");
  n.className="notification "+type;
  n.textContent = msg;
  document.body.appendChild(n);
  n.style.opacity=1;
  setTimeout(()=>{ n.style.opacity=0; setTimeout(()=>n.remove(),500); },2500);
}

// إدارة الإعلانات
let adsList = [];
const addAdBtn = document.getElementById("add-ad-btn");
if(addAdBtn){
  addAdBtn.addEventListener("click", ()=>{
    const title = document.getElementById("ad-title").value;
    const type = document.getElementById("ad-type").value;
    const link  = document.getElementById("ad-link").value;
    if(title && link){
      adsList.push({title,type,link});
      renderAds();
      document.getElementById("ad-title").value="";
      document.getElementById("ad-link").value="";
      showNotification("تم إضافة الإعلان بنجاح","success");
    } else showNotification("الرجاء ملء جميع الحقول","error");
  });
}
function renderAds(){
  document.querySelectorAll(".ads-container").forEach(container=>{
    container.innerHTML="";
    adsList.forEach(ad=>{
      const adCard = document.createElement("div");
      adCard.className="ad-card";
      if(ad.type=="gold") adCard.style.border="2px solid #FFD700";
      else if(ad.type=="silver") adCard.style.border="2px solid #C0C0C0";
      adCard.innerHTML=`<h3>${ad.title}</h3><button onclick="window.open('${ad.link}','_blank')">زيارة الإعلان</button>`;
      container.appendChild(adCard);
    });
  });
}
document.addEventListener("DOMContentLoaded", ()=> renderAds());