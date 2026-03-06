
// Tabs highlight on scroll
const tabs = document.querySelectorAll('.tabs .tab');
function setActiveTab() {
  const fromTop = window.scrollY + 80;
  const sections = Array.from(document.querySelectorAll('main section')).map(s => ({
    id: s.id,
    top: s.getBoundingClientRect().top + window.scrollY
  }));
  let current = sections[0]?.id;
  for (const s of sections) if (s.top - 100 <= fromTop) current = s.id;
  tabs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
}
window.addEventListener('scroll', setActiveTab);
setActiveTab();

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .catch(err => console.log('SW registration failed:', err));
  });
}

// PWA Install prompt handling
let deferredPrompt;
const installBanner = document.getElementById('install-banner');
const btnInstall = document.getElementById('btn-install');
const btnDismiss = document.getElementById('btn-dismiss');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBanner) installBanner.hidden = false;
});

if (btnInstall) {
  btnInstall.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice; // {outcome}
    installBanner.hidden = true;
    deferredPrompt = null;
  });
}

if (btnDismiss) {
  btnDismiss.addEventListener('click', () => {
    installBanner.hidden = true;
  });
}

// iOS Add to Home Screen helper
const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
const iosHelp = document.getElementById('ios-help');
if (isIOS && !isStandalone && iosHelp) {
  iosHelp.hidden = false;
}

// Participants filter
const filterInput = document.getElementById('people-filter');
const list = document.getElementById('people-list');
if (filterInput && list) {
  filterInput.addEventListener('input', () => {
    const q = filterInput.value.trim().toLowerCase();
    for (const li of list.querySelectorAll('li')) {
      const text = li.textContent.toLowerCase();
      li.style.display = text.includes(q) ? '' : 'none';
    }
  });
}
