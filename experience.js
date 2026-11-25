(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.button-primary, .nav-cta').forEach((control) => {
    let frame = 0;
    control.addEventListener('pointermove', (event) => {
      const rect = control.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        control.style.transform = 'translate(' + (x * 4).toFixed(1) + 'px,' + (y * 4 - 1).toFixed(1) + 'px)';
      });
    });
    control.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      control.style.transform = '';
    });
    control.addEventListener('blur', () => { control.style.transform = ''; });
  });
})();