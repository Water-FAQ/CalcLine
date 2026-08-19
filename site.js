(() => {
  const button = document.querySelector('.back-to-top');
  if (!button) return;

  const updateVisibility = () => {
    const visible = window.scrollY > 40;
    button.classList.toggle('is-visible', visible);
    button.setAttribute('aria-hidden', visible ? 'false' : 'true');
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
})();
