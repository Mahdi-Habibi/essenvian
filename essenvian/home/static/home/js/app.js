document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__list');

  const setMenuState = (isOpen) => {
    if (!menu || !toggle) return;
    menu.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  };

  if (toggle && menu) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'primary-navigation');
    menu.id = menu.id || 'primary-navigation';

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!expanded);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        setMenuState(false);
      }
    });
  }

  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.navbar__link').forEach((link) => {
    try {
      const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '') || '/';
      if (linkPath === currentPath) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    } catch {
      /* ignore malformed links */
    }
  });

  document.body.classList.add('page-enter');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.remove('page-enter'));
  });

  document.addEventListener('click', (ev) => {
    const a = ev.target.closest && ev.target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    if (a.target === '_blank' || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;

    try {
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
    } catch {
      return;
    }

    ev.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(() => {
      window.location.href = a.href;
    }, 420);
  });

  const sections = Array.from(document.querySelectorAll('main section, footer'));
  const animateClass = 'animate-fade-up';
  const inViewClass = 'in-view';

  const getSectionTargets = (section) => {
    const nodes = Array.from(section.querySelectorAll(':scope > *, .container > *, .block, .capability, .process-step, .team-member, .value-item'));
    return nodes.filter((el) => {
      const tag = (el.tagName || '').toLowerCase();
      return !['video', 'source', 'track', 'svg', 'style', 'script'].includes(tag);
    });
  };

  sections.forEach((section) => {
    getSectionTargets(section).forEach((el) => el.classList.add(animateClass));
  });

  const animateTargets = (targets) => {
    targets.forEach((el, i) => {
      if (el.dataset.animated === 'true') return;
      el.style.setProperty('--delay', `${i * 70}ms`);
      el.classList.add(inViewClass);
      el.dataset.animated = 'true';
    });
  };

  const first = sections[0];
  if (first) {
    animateTargets(getSectionTargets(first));
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateTargets(getSectionTargets(entry.target));
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  sections.forEach((section) => {
    if (section !== first) observer.observe(section);
  });
});
