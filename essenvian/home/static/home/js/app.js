document.addEventListener('DOMContentLoaded', function () {
	const toggle = document.querySelector('.navbar__toggle');
	const menu = document.querySelector('.navbar__list');

	if (toggle && menu) {
		toggle.addEventListener('click', () => {
			const expanded = menu.style.display === 'block';
			menu.style.display = expanded ? 'none' : 'block';
			toggle.setAttribute('aria-expanded', String(!expanded));
		});

		// Close menu when resizing to desktop
		window.addEventListener('resize', () => {
			if (window.innerWidth > 768) {
				menu.style.display = '';
				toggle.removeAttribute('aria-expanded');
			}
		});
	}

	// Smooth scroll for internal links
	document.querySelectorAll('a[href^="#"]').forEach(a => {
		a.addEventListener('click', function (e) {
			const target = this.getAttribute('href');
			if (target && target.startsWith('#')) {
				e.preventDefault();
				const el = document.querySelector(target);
				if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
			}
		});
	});
});
