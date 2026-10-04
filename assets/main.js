// Navigation is fully visible without JavaScript. Enhance it on narrow screens.
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.hidden = false;
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('is-open', expanded);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
// Deep links to a FAQ reveal the answer, including links used within this guide.
function revealLinkedAnswer() {
  const target = document.getElementById(location.hash.slice(1));
  if (target?.tagName === 'DETAILS') target.open = true;
}
window.addEventListener('hashchange', revealLinkedAnswer);
revealLinkedAnswer();
if ('IntersectionObserver' in window) {
  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of links) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-15% 0px -65% 0px' });
  for (const link of links) {
    const section = document.querySelector(link.hash);
    if (section) observer.observe(section);
  }
}
