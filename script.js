import pageData from './data.js';

let isDesktop, isTablet;
let activeSlide = 1;

const heroImage = document.querySelector('.hero-img');
const heading = document.querySelector('.heading-1');
const text = document.querySelector('.text-1');
const desktopScreen = matchMedia('(min-width: 1025px)');
const tabletScreen = matchMedia('(min-width: 601px) and (max-width: 1024px)');

function checkScreenSize() {
	isDesktop = desktopScreen.matches ? true : false;
	isTablet = tabletScreen.matches ? true : false;
	if (isDesktop || isTablet) {
		heroImage.src = pageData[1].heroImage.desktop;
	} else {
		heroImage.src = pageData[1].heroImage.tabletMobile;
	}
}

checkScreenSize();
desktopScreen.addListener(checkScreenSize);
tabletScreen.addListener(checkScreenSize);

const toggleNavButtons = [...document.querySelectorAll('.menu, .close')];
const slideAngles = [...document.querySelectorAll('.slide-arrows > *')];
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

function resetAnimation() {
	heroImage.classList.remove('animate-left', 'animate-right');
	heading.classList.remove('animate', 'animate-left', 'animate-right');
	text.classList.remove('animate', 'animate-left', 'animate-right');
}

slideAngles.forEach((button, index) => {
	button.addEventListener('mousedown', resetAnimation);

	button.addEventListener('click', (event) => {
		if (document.querySelector('.close').classList.contains('active')) {
			event.preventDefault();
		} else {
			clickHandler(index);
		}
	});
});

function clickHandler(index) {
	const heroImage = document.querySelector('.hero-img');

	if (isDesktop) {
		heroImage.classList.add('animate-left');
		heading.classList.add('animate');
		text.classList.add('animate');
	} else {
		if (index === 0) {
			heroImage.classList.add('animate-left');
			heading.classList.add('animate-left');
			text.classList.add('animate-left');
		} else {
			heroImage.classList.add('animate-right');
			heading.classList.add('animate-right');
			text.classList.add('animate-right');
		}
	}
	let dataIndex;

	setTimeout(() => {
		if (isDesktop) {
			dataIndex = (activeSlide % 3) + 1;
			heroImage.src = pageData[dataIndex].heroImage.desktop;
			activeSlide = pageData[dataIndex].slideNumber;
		} else {
			if (index === 0) {
				if (activeSlide === 1) {
					dataIndex = 3;
				} else {
					dataIndex = activeSlide - 1;
				}
			} else {
				if (activeSlide === 3) {
					dataIndex = 1;
				} else {
					dataIndex = activeSlide + 1;
				}
			}

			heroImage.src = pageData[dataIndex].heroImage.tabletMobile;
			activeSlide = pageData[dataIndex].slideNumber;
		}

		heading.textContent = pageData[dataIndex].textSection.heading;
		text.textContent = pageData[dataIndex].textSection.text;
	}, 375);
}

// Swipe events for touch devices 👇👇

function touchEventHandler() {
	const sectionOne = document.querySelector('.section-1');
	let startingX, startingY, changesX, changesY, swapStartTime, timeDifference;
	sectionOne.addEventListener('touchstart', (event) => {
		resetAnimation();
		startingX = event.touches[0].pageX;
		startingY = event.touches[0].pageY;
		swapStartTime = event.timeStamp;
	});

	sectionOne.addEventListener('touchmove', (event) => {
		changesX = startingX - event.touches[0].pageX;
		changesY = startingY - event.touches[0].pageY;
	});

	sectionOne.addEventListener('touchend', (event) => {
		timeDifference = event.timeStamp - swapStartTime;
		if (changesX > 0) {
			if (
				changesX > changesY &&
				changesY < 75 &&
				changesY > -75 &&
				changesX >= 75 &&
				timeDifference <= 500
			) {
				slideAngles[0].click();
			}
		} else if (changesX < 0) {
			if (
				changesX < changesY &&
				changesY > -75 &&
				changesY < 75 &&
				changesX <= -75 &&
				timeDifference <= 500
			) {
				slideAngles[1].click();
			}
		}
	});
}

touchEventHandler();
