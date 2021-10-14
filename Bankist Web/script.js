'use strict';

///////////////////////////////////////////////////////////////////////////////

const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const slides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////////////////////////////////////////////

// MODAL WINDOW
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (button) {
  button.addEventListener('click', openModal);

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
});

///////////////////////////////////////////////////////////////////////////////

// PAGE NAVIGATION
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////////////////////////////////////

// IMPLEMENT BUTTON SCROLLING
btnScrollTo.addEventListener('click', function (e) {
  // Scrolling with behaviour
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////////////////////////////////

// TABBED COMPONENT
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove and Activate Tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Remove and Activate Content
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////////////////////////////////////////

// MENU FADE ANIMATION
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const clicked = e.target;
    const siblings = clicked.closest('.nav').querySelectorAll('.nav__link');
    const logo = clicked.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== clicked) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing arguement into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////////////////////////////////

// STICKY NAVIGATION
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////////////////////////////////////////////

// REVEAL SECTIONS
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////////////////////////////////////////////

// LAZY LOADING IMAGES
const imgTarget = document.querySelectorAll(`img[data-src]`);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  // Only remove the class list when img is finished loading
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////////////////////////////////////

// SLIDER
const slider = function () {
  let currentSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach(function (_, index) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${index}"></button>`
      );
    });
  };

  const activateDot = function (curSlide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
      document
        .querySelector(`.dots__dot[data-slide="${curSlide}"]`)
        .classList.add('dots__dot--active');
    });
  };

  const goToSlide = function (curSlide) {
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${(index - curSlide) * 100}%)`)
    );
  };

  const nextSlide = function () {
    currentSlide === maxSlide - 1 ? (currentSlide = 0) : currentSlide++;
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    currentSlide === 0 ? (currentSlide = maxSlide - 1) : currentSlide--;
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    goToSlide(currentSlide);
    createDots();
    activateDot(0);
  };
  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
