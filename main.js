// مثال تفعيل Premium عبر Stripe
const premiumBtn = document.getElementById("premium-btn");
if(premiumBtn){
  premiumBtn.addEventListener("click", async ()=>{
    const price = 10; // دولار
    const response = await fetch("https://telegram-hub-mini-server.onrender.com/create-checkout-session", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({price,userId:"USER123"})
    });
    const data = await response.json();
    if(data.url) window.location.href = data.url;
    else showNotification("خطأ في الدفع","error");
  });
}

