// The images explain the extension; these buttons select their explanations.
for (const section of document.querySelectorAll('.tutorial-step')) {
  const pins = [...section.querySelectorAll('.hotspot')];
  const explanations = [...section.querySelectorAll('.control-explanations li')];
  for (const pin of pins) {
    pin.hidden = false;
    pin.addEventListener('click', () => {
      for (const other of pins) {
        other.setAttribute('aria-pressed', String(other === pin));
      }
      for (const explanation of explanations) {
        explanation.classList.toggle('is-selected',
          explanation.id === pin.dataset.explanation);
      }
      const selected = document.getElementById(pin.dataset.explanation);
      selected.tabIndex = -1;
      selected.focus({ preventScroll: true });
      if (matchMedia('(max-width: 800px)').matches) {
        selected.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    });
  }
}
