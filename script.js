(() => {
  'use strict';

  const config = { loaderTop: 'За новую', loaderBottom: 'Индустриализацию!', counterDuration: 1600 };
  const byId = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function typeLoader() {
    const outputTop = byId('loaderTextTop');
    const outputBottom = byId('loaderTextBottom');
    const loader = byId('loader');
    let index = 0;
    const phrase = `${config.loaderTop}${config.loaderBottom}`;
    const draw = () => {
      outputTop.textContent = phrase.slice(0, index).slice(0, config.loaderTop.length);
      outputBottom.textContent = phrase.slice(config.loaderTop.length, index);
      index += 1;
      if (index <= phrase.length) window.setTimeout(draw, reduceMotion ? 0 : 36);
      else window.setTimeout(() => loader.classList.add('is-done'), reduceMotion ? 0 : 410);
    };
    draw();
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(value));
  }

  function animateNumber(element, target, duration, suffix = '') {
    const start = performance.now();
    const render = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = `${formatNumber(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  function initializeFigures() {
    const figures = byId('figures');
    if (!('IntersectionObserver' in window)) {
      figures.querySelectorAll('[data-counter]').forEach((element) => animateNumber(element, Number(element.dataset.counter), reduceMotion ? 0 : 450, ' ₽'));
      return;
    }
    const observer = new IntersectionObserver((entries, current) => {
      if (!entries[0].isIntersecting) return;
      figures.querySelectorAll('[data-counter]').forEach((element) => animateNumber(element, Number(element.dataset.counter), 1700, ' ₽'));
      current.disconnect();
    }, { threshold: 0.25 });
    observer.observe(figures);
  }

  function setupNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = byId('mainNav');
    const closeNavigation = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    };
    toggle.addEventListener('click', () => {
      const opened = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(opened));
      nav.classList.toggle('is-open', opened);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      closeNavigation();
    }));
    const breakpoint = window.matchMedia('(max-width: 760px)');
    const resetAfterViewportChange = () => closeNavigation();
    if (typeof breakpoint.addEventListener === 'function') breakpoint.addEventListener('change', resetAfterViewportChange);
    else breakpoint.addListener(resetAfterViewportChange);
    closeNavigation();
  }

  function setupDialogs() {
    const ideaDialog = byId('ideaDialog');
    const openDialog = (dialog) => {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.classList.add('is-open');
    };
    const closeDialog = (dialog) => {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.classList.remove('is-open');
    };
    document.querySelectorAll('[data-step-title]').forEach((button) => button.addEventListener('click', () => {
      byId('ideaTopic').textContent = button.dataset.stepTitle;
      byId('ideaText').value = '';
      openDialog(ideaDialog);
    }));
    document.querySelectorAll('[data-dialog-open]').forEach((button) => button.addEventListener('click', () => openDialog(byId(button.dataset.dialogOpen))));
    document.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => closeDialog(button.closest('dialog'))));
    byId('ideaSubmit').addEventListener('click', () => {
      byId('ideaDialog').querySelector('.dialog__message').textContent = '';
    });
  }

  function setupCarousel() {
    const slides = [...document.querySelectorAll('[data-video-slide]')];
    const status = byId('videoStatus');
    let current = 0;
    const go = (next) => {
      current = (next + slides.length) % slides.length;
      slides.forEach((slide, index) => slide.classList.toggle('is-active', index === current));
      status.textContent = `${current + 1} / ${slides.length}`;
    };
    byId('videoPrev').addEventListener('click', () => go(current - 1));
    byId('videoNext').addEventListener('click', () => go(current + 1));
    byId('videoCarousel').addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') go(current - 1);
      if (event.key === 'ArrowRight') go(current + 1);
    });
  }

  function setupPeopleCarousels() {
    document.querySelectorAll('[data-people-carousel]').forEach((carousel) => {
      const track = carousel.querySelector('.people-carousel__track');
      const previous = carousel.querySelector('[data-people-prev]');
      const next = carousel.querySelector('[data-people-next]');
      const getStep = () => Math.max(track.clientWidth * 0.86, 220);
      previous.addEventListener('click', () => track.scrollBy({ left: -getStep(), behavior: reduceMotion ? 'auto' : 'smooth' }));
      next.addEventListener('click', () => track.scrollBy({ left: getStep(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    });
    document.querySelectorAll('[data-placeholder-link]').forEach((link) => link.addEventListener('click', (event) => event.preventDefault()));
  }

  function setupMockForm() {
    byId('signForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const message = form.querySelector('.form-message');
      if (!form.checkValidity()) {
        form.reportValidity();
        message.textContent = '';
        return;
      }
      message.textContent = '';
    });
  }

  function initializePage() {
    typeLoader();
    initializeFigures();
    setupNavigation();
    setupDialogs();
    setupCarousel();
    setupPeopleCarousels();
    setupMockForm();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializePage, { once: true });
  else initializePage();
})();
