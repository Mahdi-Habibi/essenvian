document.addEventListener('DOMContentLoaded', function () {
	const toggle = document.querySelector('.navbar__toggle');
	const menu = document.querySelector('.navbar__list');

	if (toggle && menu) {
		toggle.addEventListener('click', () => {
			const expanded = toggle.getAttribute('aria-expanded') === 'true';
			menu.classList.toggle('is-open', !expanded);
			toggle.setAttribute('aria-expanded', String(!expanded));
		});

		window.addEventListener('resize', () => {
			if (window.innerWidth > 768) {
				menu.classList.remove('is-open');
				toggle.setAttribute('aria-expanded', 'false');
			}
		});
	}
});
