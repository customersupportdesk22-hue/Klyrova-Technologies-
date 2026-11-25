(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  // Touch devices receive a brief press animation instead of pointer-follow movement.
  const touchTargets = document.querySelectorAll('.button-primary, .nav-cta, .project-card');
  touchTargets.forEach((control) => {
    let touchTimer = null;
    control.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
      control.classList.add('is-touch-active');
      if (touchTimer) window.clearTimeout(touchTimer);
    });
    const releaseTouch = () => {
      if (touchTimer) window.clearTimeout(touchTimer);
      touchTimer = window.setTimeout(() => control.classList.remove('is-touch-active'), 260);
    };
    control.addEventListener('pointerup', releaseTouch);
    control.addEventListener('pointercancel', releaseTouch);
    control.addEventListener('pointerleave', releaseTouch);
  });

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