// Navigation is fully visible without JavaScript. Enhance it on narrow screens.
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const pageNavigation = document.querySelector('#page-navigation');
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
for (const nav of [navigation, pageNavigation]) {
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
}
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
// Highlight the section being read in the second header row.
if ('IntersectionObserver' in window) {
  const links = [...pageNavigation.querySelectorAll('a[href^="#"]')];
  const sections = new Map();
  for (const link of links) {
    const target = document.querySelector(link.hash);
    if (target) sections.set(target.closest('section') ?? target, link);
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const activeLink = sections.get(entry.target);
      for (const link of links) {
        if (link === activeLink) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-148px 0px -50% 0px' });
  for (const section of sections.keys()) observer.observe(section);
}
