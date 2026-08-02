(() => {
  'use strict';

  const config = { loaderText: 'За новую индустриализацию!', counterDuration: 1600 };
  const byId = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function typeLoader() {
    const output = byId('loaderText');
    const loader = byId('loader');
    let index = 0;
    const draw = () => {
      output.textContent = config.loaderText.slice(0, index);
      index += 1;
      if (index <= config.loaderText.length) window.setTimeout(draw, reduceMotion ? 0 : 36);
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

  function initializeSignatureCounter() {
    const counter = document.querySelector('.counter');
    const value = Number(counter.dataset.value);
    const goal = Number(counter.dataset.goal);
    const percent = Math.round((value / goal) * 100);
    animateNumber(byId('signatureCount'), value, config.counterDuration);
    byId('counterPercent').textContent = `${percent}%`;
    byId('counterBar').style.width = `${percent}%`;
  }

  function initializeFigures() {
    const figures = byId('figures');
    if (!('IntersectionObserver' in window)) return;
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
    toggle.addEventListener('click', () => {
      const opened = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(opened));
      nav.classList.toggle('is-open', opened);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }));
  }

  function setupDialogs() {
    const ideaDialog = byId('ideaDialog');
    document.querySelectorAll('[data-step-title]').forEach((button) => button.addEventListener('click', () => {
      byId('ideaTopic').textContent = button.dataset.stepTitle;
      byId('ideaText').value = '';
      ideaDialog.showModal();
    }));
    document.querySelectorAll('[data-dialog-open]').forEach((button) => button.addEventListener('click', () => byId(button.dataset.dialogOpen).showModal()));
    document.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
    byId('ideaSubmit').addEventListener('click', () => {
      byId('ideaDialog').querySelector('.dialog__message').textContent = 'Макет принят: предложение не отправлено и не сохранено.';
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

  function setupMockForm() {
    byId('signForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const message = form.querySelector('.form-message');
      if (!form.checkValidity()) {
        form.reportValidity();
        message.textContent = 'Заполните обязательные поля и подтвердите согласие.';
        return;
      }
      message.textContent = 'Спасибо! Это согласовательный макет: данные не отправлены и не сохранены.';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    typeLoader();
    initializeSignatureCounter();
    initializeFigures();
    setupNavigation();
    setupDialogs();
    setupCarousel();
    setupMockForm();
  });
})();
