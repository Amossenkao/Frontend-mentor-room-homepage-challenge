import pageData from './data.js';

let isDesktop, isTablet;
let activeSlide = 1;

const heroImage = document.querySelector('.hero-img');
const textContainer = document.querySelector('.section-1 .text-container');
const heading = document.querySelector('.heading-1');
const text = document.querySelector('.text-1');
const desktopScreen = matchMedia('(min-width: 1025px)');
const tabletScreen = matchMedia('(min-width: 601px) and (max-width: 1024px)');
let slideButtons;

function checkScreenSize() {
	isDesktop = desktopScreen.matches ? true : false;
	isTablet = tabletScreen.matches ? true : false;
	if (isDesktop || isTablet) {
		heroImage.src = pageData[1].heroImage.desktop;
		if (isDesktop) {
			const desktopSlideButtons = document.createElement('div');
			desktopSlideButtons.className = 'slide-arrows desktop';
			desktopSlideButtons.innerHTML =
				document.querySelector('.slide-arrows').innerHTML;
			document
				.querySelector('.section-1 .text-button')
				.append(desktopSlideButtons);
		} else {
			try {
				document.querySelector('slide-arrows.desktop').remove();
			} catch {}
		}
	} else {
		heroImage.src = pageData[1].heroImage.tabletMobile;
		try {
			document.querySelector('slide-arrows.desktop').remove();
		} catch {}
	}
}

checkScreenSize();
desktopScreen.addListener(checkScreenSize);
tabletScreen.addListener(checkScreenSize);

const toggleNavButtons = [...document.querySelectorAll('.menu, .close')];
slideButtons = isDesktop
	? [...document.querySelectorAll('.slide-arrows.desktop > *')]
	: [...document.querySelectorAll('.slide-arrows > *')];
const navMenu = [...document.querySelectorAll('.nav-menu > li')];

toggleNavButtons.forEach((btn) => {
	btn.addEventListener('click', () => {
		document.querySelector('.nav-menu-wrapper').classList.toggle('shown');
		document.body.classList.toggle('open-nav');
		btn.classList.remove('active');

		setTimeout(() => {
			if (btn.classList.contains('menu')) {
				document.querySelector('.close').classList.add('active');
			} else {
				document.querySelector('.menu').classList.add('active');
			}
		}, 300);
	});
});

navMenu.forEach((listItem) => {
	listItem.addEventListener('click', () => {
		navMenu.forEach((item) => {
			item.classList.remove('active');
		});
		listItem.classList.add('active');
	});
});

document.addEventListener('click', (event) => {
	const clostToggle = toggleNavButtons[1];
	const navMenu = document.querySelector('.nav-menu-wrapper');
	if (
		clostToggle.classList.contains('active') &&
		!navMenu.contains(event.target)
	) {
		clostToggle.click();
	}
});

function getTtransformProperty(element) {
	return element.style.transform === ''
		? 0
		: Number(element.style.transform.split('(')[1].split('%')[0]);
}

slideButtons.forEach((button, index) => {
	button.addEventListener('click', (event) => {
		let transform = getTtransformProperty(heroImage);
		if (document.querySelector('.close').classList.contains('active')) {
			event.preventDefault();
		} else if (
			button.classList.contains('angle-left') &&
			transform <= -200
		) {
			event.preventDefault();
		} else if (button.classList.contains('angle-right') && transform >= 0) {
			event.preventDefault();
		} else {
			if (index === 0) {
				document
					.querySelectorAll('.hero-img, .section-1 .text-container')
					.forEach((img) => {
						img.style.transform = `translate(${transform - 100}%)`;
					});
			} else {
				document
					.querySelectorAll('.hero-img, .section-1 .text-container')
					.forEach((img) => {
						img.style.transform = `translate(${transform + 100}%)`;
					});
			}
		}
	});
});

function appendElenemts() {
	for (let i = 2; i <= 3; i++) {
		const imageElement = document.createElement('img');
		const textElement = document.createElement('div');
		textElement.innerHTML = textContainer.innerHTML;
		textElement.querySelector('.heading-1').textContent =
			pageData[i].textSection.heading;
		textElement.querySelector('.text-1').textContent =
			pageData[i].textSection.text;
		imageElement.className = 'hero-img';
		textElement.className = 'text-container';
		if (isDesktop || isTablet) {
			imageElement.src = pageData[i].heroImage.desktop;
		} else {
			imageElement.src = pageData[i].heroImage.tabletMobile;
		}

		heroImage.parentElement.append(imageElement);
		textContainer.parentElement.append(textElement);
	}
}

appendElenemts();

// Swipe events for touch devices 👇👇

function touchEventHandler() {
	const sectionOne = document.querySelector('.section-1');
	let startingX, startingY, changesX, changesY, swapStartTime, timeDifference;
	document.querySelectorAll('.hero-img').forEach((image) => {
		image.addEventListener('touchstart', (event) => {
			startingX = event.touches[0].pageX;
			startingY = event.touches[0].pageY;
			swapStartTime = event.timeStamp;
		});

		image.addEventListener('touchmove', (event) => {
			changesX = startingX - event.touches[0].pageX;
			changesY = startingY - event.touches[0].pageY;
		});

		image.addEventListener('touchend', (event) => {
			timeDifference = event.timeStamp - swapStartTime;
			if (changesX > 0) {
				if (
					changesX > changesY &&
					changesY < 75 &&
					changesY > -75 &&
					changesX >= 50 &&
					timeDifference <= 500
				) {
					slideButtons[0].click();
				}
			} else if (changesX < 0) {
				if (
					changesX < changesY &&
					changesY > -75 &&
					changesY < 75 &&
					changesX <= -50 &&
					timeDifference <= 500
				) {
					slideButtons[1].click();
				}
			}
		});
	});
}

touchEventHandler();
