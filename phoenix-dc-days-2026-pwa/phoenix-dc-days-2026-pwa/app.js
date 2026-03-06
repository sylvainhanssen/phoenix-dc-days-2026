
// Smooth-scroll and active tab handling
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

tabs.forEach(a => a.addEventListener('click', e => {
  // default anchor jump is fine; keep class sync
  setTimeout(setActiveTab, 100);
}));
window.addEventListener('scroll', setActiveTab);
setActiveTab();

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .catch(err => console.log('SW registration failed:', err));
  });
}
