(() => {
  'use strict';
  const story = document.querySelector('.story');
  const video = document.getElementById('build-video');
  const steps = [...document.querySelectorAll('.story-step')];
  const toggle = document.getElementById('motion-toggle');
  const label = document.getElementById('build-stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const names = ['Scroll to build', 'Real parts', 'A foundation', 'Make it think', 'Ready to build'];
  let enabled = false, pending = false, desired = 0, currentStep = -1, ready = false;
  function showStep(index) {
    if (index === currentStep) return;
    currentStep = index;
    steps.forEach((step, i) => { step.classList.toggle('active', i === index); step.setAttribute('aria-hidden', String(i !== index)); });
    label.textContent = names[index];
  }
  function seek() {
    if (!ready || video.seeking || !Number.isFinite(video.duration)) return;
    const target = Math.min(video.duration - .04, Math.max(0, desired));
    if (Math.abs(video.currentTime - target) > .035) video.currentTime = target;
  }
  function update() {
    pending = false;
    if (!enabled || !ready) return;
    const rect = story.getBoundingClientRect();
    const distance = Math.max(1, story.offsetHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / distance));
    desired = progress * video.duration;
    story.style.setProperty('--progress', progress);
    showStep(progress < .16 ? 0 : progress < .34 ? 1 : progress < .57 ? 2 : progress < .81 ? 3 : 4);
    seek();
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  function setEnabled(value) {
    enabled = value;
    story.classList.toggle('motion-ready', ready && !reduced.matches);
    toggle.textContent = value ? 'Pause animation' : 'Enable animation';
    toggle.setAttribute('aria-pressed', String(!value));
    if (!value) video.pause(); else schedule();
  }
  video.addEventListener('loadeddata', () => {
    ready = true;
    story.classList.add('has-video');
    setEnabled(!reduced.matches);
  });
  video.addEventListener('seeked', () => { if (enabled) seek(); });
  video.addEventListener('error', () => { ready = false; story.classList.remove('has-video'); setEnabled(false); toggle.hidden = true; });
  toggle.addEventListener('click', () => {
    if (!video.src) { video.src = video.dataset.src; video.load(); }
    setEnabled(!enabled);
  });
  reduced.addEventListener('change', () => setEnabled(!reduced.matches));
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  showStep(0);
  toggle.hidden = false;
  if (!reduced.matches && !navigator.connection?.saveData) { video.src = video.dataset.src; video.load(); }
  else { toggle.textContent = 'Enable animation'; toggle.setAttribute('aria-pressed','true'); }
})();
