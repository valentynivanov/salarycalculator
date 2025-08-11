
// ==== Cookie Consent Modal + GA Loader ====

// Helper to check if cookie exists
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Save cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days*24*60*60*1000));
  document.cookie = `${name}=${value}; path=/; expires=${date.toUTCString()}; SameSite=Lax`;
}

// Inject Google Analytics script
function loadGA() {
  if (window.gaLoaded) return; // Avoid double load
  window.gaLoaded = true;

  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ELYTNDXR2M"; 
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-ELYTNDXR2M'); 
}

// Hide modal
function hideModal() {
  const modal = document.getElementById('cookie-consent-modal');
  if (modal) modal.remove();
}

// Show cookie modal
function showModal() {
  const modal = document.createElement('div');
    modal.id = 'cookie-consent-modal';
    modal.style = `
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
    background: rgba(0,0,0,0.5); 
    backdrop-filter: blur(5px);
    display: flex; 
    align-items: center; 
    justify-content: center;
    z-index: 9999;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    opacity: 0;
    transition: all 0.3s ease;
    padding: 20px;
    box-sizing: border-box;
    `;

    modal.innerHTML = `
    <div style="
        background: rgba(255, 255, 255, 0.95); 
        backdrop-filter: blur(20px);
        max-width: 480px; 
        width: 100%;
        padding: 35px; 
        border-radius: 20px; 
        text-align: center; 
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transform: scale(0.9) translateY(-20px);
        transition: all 0.3s ease;
    ">
        <div style="
        font-size: 2.5rem; 
        margin-bottom: 15px;
        ">🍪</div>
        
        <h3 style="
        color: #2c3e50; 
        font-size: 1.4rem; 
        font-weight: 700; 
        margin: 0 0 15px 0;
        line-height: 1.3;
        ">Cookie Consent</h3>
        
        <p style="
        color: #7f8c8d; 
        font-size: 1rem; 
        line-height: 1.6; 
        margin: 0 0 25px 0;
        font-weight: 400;
        ">We use essential cookies to make our site work properly and analytics cookies to understand how you use our website. Your privacy matters to us.</p>
        
        <div style="
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
        ">
        <button id="accept-cookies" style="
            padding: 12px 24px; 
            background: linear-gradient(135deg, #27ae60, #219a52); 
            color: white; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            min-width: 100px;
            font-family: inherit;
        " 
        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 15px rgba(39, 174, 96, 0.3)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            Accept All
        </button>
        
        <button id="decline-cookies" style="
            padding: 12px 24px; 
            background: rgba(231, 76, 60, 0.1);
            color: #e74c3c; 
            border: 2px solid rgba(231, 76, 60, 0.2);
            border-radius: 8px; 
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            min-width: 100px;
            font-family: inherit;
        "
        onmouseover="this.style.background='rgba(231, 76, 60, 0.15)'; this.style.borderColor='rgba(231, 76, 60, 0.3)'"
        onmouseout="this.style.background='rgba(231, 76, 60, 0.1)'; this.style.borderColor='rgba(231, 76, 60, 0.2)'">
            Decline
        </button>
        </div>
    `;

    // Add entrance animation
    setTimeout(() => {
    modal.style.opacity = '1';
    modal.firstElementChild.style.transform = 'scale(1) translateY(0)';
    }, 10);

    // Add mobile responsive styles

  document.body.appendChild(modal);

  document.getElementById('accept-cookies').onclick = () => {
    setCookie('ga_consent', 'true', 365);
    loadGA();
    hideModal();
  };

  document.getElementById('decline-cookies').onclick = () => {
    setCookie('ga_consent', 'false', 365);
    hideModal();
  };
}

// Main logic on page load
document.addEventListener('DOMContentLoaded', () => {
  const consent = getCookie('ga_consent');

  if (consent === 'true') {
    loadGA(); // Already accepted
  } else if (consent === 'false') {
    // Declined - do nothing
  } else {
    showModal(); // No choice yet
  }
});
