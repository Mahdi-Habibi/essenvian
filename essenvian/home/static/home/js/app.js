document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__list');

  if (!toggle || !menu) {
    return;
  }

  const setMenuState = (isOpen) => {
    menu.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!expanded);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      setMenuState(false);
    }
  });

  // Page enter animation: start with hidden then remove class to fade in
  document.body.classList.add('page-enter');
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('page-enter')));

  // Intercept internal link clicks to play a fade-out then navigate
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest && ev.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;

    // Ignore anchors, external links, and new-tab navigation
    if (href.startsWith('#')) return;
    if (a.target === '_blank' || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
    try {
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return; // external
    } catch (e) {
      return; // malformed URL
    }

    ev.preventDefault();
    document.body.classList.add('page-exit');
    // match CSS transition duration (ms)
    const delay = 450;
    setTimeout(() => (window.location.href = a.href), delay);
  });

  // Fade-up per-section animation (once per section until reload)
  const sections = Array.from(document.querySelectorAll('main section, footer'));
  const animateClass = 'animate-fade-up';
  const inViewClass = 'in-view';

  const getSectionTargets = (section) => {
    // select typical visible children: direct children and container children and cards
    const nodes = Array.from(section.querySelectorAll(':scope > * , .container > * , .card'));
    // exclude video and other non-visual elements
    return nodes.filter((el) => {
      const t = (el.tagName || '').toLowerCase();
      if (t === 'video' || t === 'source' || t === 'track' || t === 'svg') return false;
      return true;
    });
  };

  // Apply initial hidden state to targets
  sections.forEach((section) => {
    const nodeList = getSectionTargets(section);
    nodeList.forEach((el) => el.classList.add(animateClass));
  });

  const animateTargets = (targets) => {
    targets.forEach((el, i) => {
      if (el.dataset.animated === 'true') return;
      el.style.setProperty('--delay', `${i * 80}ms`);
      el.classList.add(inViewClass);
      el.dataset.animated = 'true';
    });
  };

  // Animate first section immediately on load
  const first = sections[0];
  if (first) {
    const firstTargets = getSectionTargets(first);
    animateTargets(firstTargets);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targets = getSectionTargets(entry.target);
          animateTargets(targets);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
  );

  sections.forEach((s) => {
    if (s === first) return;
    observer.observe(s);
  });
});
