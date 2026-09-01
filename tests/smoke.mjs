import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const js = await readFile(new URL('../script.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

const expect = (condition, message) => assert.ok(condition, message);
const count = (pattern) => (html.match(pattern) || []).length;

expect(html.includes('id="loader"'), 'Экран загрузки отсутствует');
expect(html.includes('id="loaderTextTop"') && html.includes('id="loaderTextBottom"'), 'Динамический текст логотипа отсутствует');
expect(!html.includes('id="steps"') && !html.includes('class="step"'), 'Блок «10 шагов» должен быть полностью удалён');
expect(count(/class="faq__item"/g) === 4, 'Должно быть 4 вопроса в FAQ');
expect(count(/data-video-slide/g) === 2, 'Должны быть подготовлены 2 видеослайда');
expect(count(/supporter-placeholder/g) >= 3, 'Нет резерва под PNG-портреты');
expect(count(/data-people-carousel/g) === 1, 'Должна быть карусель с будущими фотографиями');
expect(count(/data-placeholder-link/g) >= 5, 'Фотографии и ссылки-заглушки должны быть кликабельными');
expect(html.includes('aria-label="Открыть меню"'), 'У мобильного меню отсутствует понятная подпись');
expect(count(/class="situation__card"/g) === 4, 'На втором экране должно быть четыре информационных блока');
expect(html.includes('Что происходит с Россией сегодня?'), 'Не обновлён заголовок второго экрана');
expect(!html.includes('02 · Сегодня'), 'Во втором блоке не должно остаться подписи «02 · Сегодня»');
expect(count(/assets\/situation-(economy|production|regions|agriculture)\.png/g) === 4, 'Для проблем второго блока должны использоваться четыре предоставленные иллюстрации');
expect(css.includes('.situation__card-head img{display:block;width:92px;height:92px') && css.includes('.situation__card-head img{width:76px;height:76px}'), 'Иконки второго блока должны быть адаптированы для desktop и mobile');
[
  'Отставание в экономике',
  'Печальная динамика ВВП: последние двадцать лет темп роста ВВП России составляет в среднем',
  'Отставание в производстве',
  'Пустеющие регионы',
  'Заброшенные земли',
  'Эти проблемы связаны между собой. Если в регионе нет производства — нет работы.'
].forEach((text) => expect(html.includes(text), `Не перенесён текст второго экрана: ${text}`));
expect(!html.includes('Нас уже поддержали') && !html.includes('counter-section__quote'), 'На втором экране не должны оставаться прежние счётчик и цитата');
expect(html.includes('action=' ) === false, 'Форма не должна иметь endpoint в согласовательном макете');
expect(html.includes('required') && html.includes('Политика обработки персональных данных'), 'Форма должна содержать обязательное согласие');
expect(js.includes('event.preventDefault()'), 'Форма должна предотвращать передачу данных');
expect(js.includes('showModal()'), 'Интерактивная подсказка должна открываться в окне');
expect(js.includes("typeof dialog.showModal === 'function'"), 'Для Android WebView должен быть fallback-механизм окон');
expect(js.includes("document.readyState === 'loading'"), 'Интерактивы должны запускаться и после быстрой загрузки документа');
expect(js.includes("window.matchMedia('(max-width: 760px)')") && js.includes('resetAfterViewportChange'), 'Мобильное меню должно сбрасываться при изменении ширины окна');
expect(js.includes('IntersectionObserver') && js.includes('[data-reveal]'), 'Для обновлённых блоков должен быть настроен эффект появления при прокрутке');
expect(css.includes('@media(max-width:760px)'), 'Отсутствует мобильный breakpoint');
expect(css.includes('position:fixed;z-index:1;top:74px') && css.includes('min-height:calc(100dvh - 74px)'), 'Мобильное меню должно открываться отдельной непрозрачной панелью');
expect(css.includes('prefers-reduced-motion'), 'Не учтено предпочтение уменьшенной анимации');
expect(!html.includes('↘'), 'В CTA не должно оставаться стрелок, направленных вниз');
expect(html.includes('200 000 подписей — это голос'), 'В FAQ должна быть актуальная цель в 200 000 подписей');
expect(!html.includes('Миллион подписей'), 'В FAQ не должно остаться упоминания миллиона подписей');
expect(html.includes('в течение трех рабочих дней'), 'Срок удаления данных должен быть записан словом');
['--blue:#26358c', '--blue-deep:#2d2378', '--blue-soft:#404695', '--yellow:#f2e60e', '--yellow-light:#f3eb81', '--yellow-deep:#edc012'].forEach((token) => expect(css.includes(token), `В стилях отсутствует цвет брендбука ${token}`));
expect(css.includes('"Museo Sans Cyrl"') && css.includes('"Museo Sans Cyrillic"'), 'Не настроен стек шрифтов Museo Sans Cyrillic');
expect(css.includes('.nav{position:static') && css.includes('gap:30px'), 'Верхнее меню должно быть возвращено к исходному расположению справа');
expect(css.includes("content:'«'") && css.includes("content:'»'") && css.includes('top:50%') && css.includes('translateY(-50%)') && css.includes('background:transparent'), 'Цитата должна быть без тёмной подложки и с симметричными кавычками');
expect(count(/assets\/logo-ni\.png/g) === 4, 'Предоставленный PNG-логотип должен использоваться в загрузчике, шапке и дважды в подвале');
expect(!html.includes('assets/logo-ni.svg'), 'Старая вручную собранная SVG-версия логотипа не должна оставаться в разметке');
expect(css.includes('.header{background:var(--blue)') && css.includes('.nav a,.nav a+a:before{color:var(--yellow)}'), 'Шапка должна быть синей, а пункты меню — жёлтыми');
expect(css.includes('.hero__lead span{background:none;color:var(--blue)') && css.includes('.steps__quote:before,.steps__quote:after{color:var(--blue)}'), 'Акцент в hero и кавычки должны быть синими');
expect(html.includes('<span>Новая</span> <span>индустриализация</span>'), 'Не обновлён заголовок стартового экрана');
expect(html.includes('href="#program">О программе</a>') && html.includes('href="#future">Цели</a>') && html.includes('href="#support">Поддержать</a>'), 'Верхняя панель не соответствует утверждённой навигации');
expect(html.includes('class="button button--blue" href="#support">Поддержать программу'), 'На первом экране должна остаться кнопка поддержки');
expect(html.includes('Нам нужна страна, где своё дело и работа дают счастливую и безбедную жизнь'), 'Не добавлен подзаголовок первого экрана');
[
  'Чтобы молодёжь оставалась в родных городах и создавала семьи.',
  'Чтобы предприятия росли и появлялись новые рабочие места.',
  'Чтобы сёла развивались, а земля приносила урожай и достаток.',
  'Чтобы труд приносил справедливый доход.',
  'Чтобы мы гордились своим качеством и уровнем жизни.',
  'Мы знаем, как этого добиться! Новая индустриализация — реальный план развития экономики России.'
].forEach((text) => expect(html.includes(text), `Не перенесён текст первого экрана: ${text}`));
const causesFlow = html.match(/<ol class="causes__flow">([\s\S]*?)<\/ol>/)?.[1] ?? '';
expect((causesFlow.match(/<li\b/g) || []).length === 7, 'Схема замкнутого круга должна содержать семь этапов');
expect(html.includes('Почему это происходит') && html.includes('Замкнутый круг ошибок'), 'Не добавлены заголовки третьего экрана');
expect(count(/assets\/cause-(inflation-goal|rate|investment|import|production|goods|inflation-return)\.png/g) === 7, 'Для каждого этапа схемы должна использоваться отдельная иллюстрация');
expect(html.includes('Главный парадокс:') && html.includes('боремся с инфляцией → подавляем производство → создаём условия для новой инфляции.'), 'Не добавлен вывод третьего экрана');
expect(css.includes('.causes__step--1') && css.includes('.causes__step--7') && css.includes('.causes__arrows{position:absolute') && css.includes('.causes__arrows{display:none}'), 'Третий экран должен иметь отдельные desktop- и mobile-компоновки');
expect(count(/class="causes__cycle-icon"/g) === 2 && count(/assets\/cycle-arrows\.png/g) === 2, 'Значок замкнутого круга должен использовать единый PNG в центре и в блоке вывода');
expect(count(/class="foundation__pillar"/g) === 3, 'Четвёртый экран должен содержать три опоры новой индустриализации');
expect(html.includes('Что такое новая индустриализация?') && html.includes('Три кита новой индустриализации:'), 'Не добавлены заголовки четвёртого экрана');
expect(html.includes('Мягкая денежно-кредитная политика') && html.includes('Стимулирующая налоговая система') && html.includes('Разумный протекционизм'), 'Не добавлены все три опоры новой индустриализации');
const futureList = html.match(/<ol class="future__list">([\s\S]*?)<\/ol>/)?.[1] ?? '';
expect((futureList.match(/<li>/g) || []).length === 7, 'Пятый экран должен содержать семь изменений');
expect(html.includes('Как изменится жизнь в стране с новой индустриализацией?') && html.includes('Я ТОЖЕ ЭТОГО ХОЧУ'), 'Не добавлены заголовок и кнопка пятого экрана');
['Будет работа', 'Будут достойные доходы', 'Будут новые технологии', 'Будут жить регионы', 'Будет проще развивать производство', 'Будут появляться свои товары', 'Будет расти село'].forEach((text) => expect(html.includes(text), `Не перенесён пункт пятого экрана: ${text}`));
expect(!html.includes('class="author section"') && !html.includes('id="authorTitle"'), 'Страница об авторе концепции должна быть удалена');
expect(html.includes('Подпись не несёт юридических последствий. Отдав подпись за Новую Индустриализацию вы поддержите программу и усилите её политический вес.'), 'Не обновлён ответ о юридических последствиях подписи');
expect(css.includes('@media (min-width:761px)') && css.includes('@media (max-width:760px)'), 'Для актуальных правок должны быть отдельные правила desktop и mobile');
expect(css.includes('.support-fab{min-width:280px') && css.includes('.hero__inner .button{position:relative;width:min(100%,500px);min-width:420px;justify-content:center') && css.includes('.hero__inner .button span{position:absolute;right:32px}'), 'CTA-кнопки не получили требуемые размеры и выравнивание');
expect(css.includes('.hero--programme h1 span:last-child{white-space:nowrap}') && css.includes('word-break:keep-all'), 'Мобильный заголовок должен сохранять слово «индустриализация» целиком');
expect(html.includes('assets/hero-industrialization-desktop.png') && html.includes('assets/hero-industrialization-mobile.png'), 'Для первого экрана должны использоваться desktop- и mobile-версии иллюстрации');
expect(count(/assets\/goal-(family|industry|agriculture|income|pride)\.png/g) === 5, 'Для целей первого экрана должны использоваться пять предоставленных иллюстраций');
expect(css.includes('.loader::after{content:"";position:absolute;top:100%;left:0;width:100%;height:120px') && css.includes('height:max(120px,env(safe-area-inset-bottom))'), 'У мобильного экрана загрузки должен быть синий нижний запас под панелью браузера');

[
  'Почему действовать нужно сейчас',
  'Поля формы',
  'Нашу программу поддержали'
].forEach((text) => expect(html.includes(text), `Не перенесён обязательный текст ТЗ: ${text}`));

// Блок 6: секция «10 шагов» снесена полностью.
[
  '10 шагов к новой индустриализации',
  'Поддержка вместо налогов',
  'Мы — работники, предприниматели, аграрии, инженеры, учёные и творцы. Мы создаём страну и хотим сделать её великой и богатой'
].forEach((text) => expect(!html.includes(text), `Текст блока «10 шагов» должен быть удалён: ${text}`));

// Блок 7: заголовок «Созидание...» убран, кнопка ведёт к общей поддержке программы.
expect(!html.includes('Созидание должно снова стать основой развития России'), 'Заголовок «Созидание должно снова стать основой развития России» должен быть удалён');
expect(html.includes('id="whyTitle" class="why__title">Почему действовать нужно сейчас'), 'Оставшийся подзаголовок должен стать заголовком седьмого блока');
expect(!html.includes('Поддержать 10 шагов'), 'Кнопка седьмого блока не должна ссылаться на удалённые «10 шагов»');
expect(html.includes('class="button button--outline" href="#support">Поддержать программу'), 'Кнопка седьмого блока должна называться «Поддержать программу»');

// Блок 8: убраны слоган и надпись «Вариант 1».
expect(!html.includes('Русский – значит богатый'), 'Слоган «Русский – значит богатый!» должен быть удалён');
expect(!html.includes('Вариант 1'), 'Надпись «Вариант 1» над формой должна быть удалена');
expect(html.includes('class="sign-form__title"><b>Заполнить форму на сайте'), 'Заголовок формы должен остаться без нумерации варианта');

// Блок 10 и подвал: убрана нумерация FAQ и подпись подвала, добавлены лого и соцкнопки.
expect(!html.includes('08 · Ответы'), 'Подпись «08 · Ответы» должна быть удалена');
expect(!html.includes('Когда тысячи верят в идею') && !html.includes('идея приходит в реальность'), 'Прежняя надпись подвала должна быть удалена');
expect(html.includes('footer__top-brand'), 'В подвале вместо надписи должен появиться логотип с надписью');
expect(count(/footer__resources.*?<\/div>/s) >= 1 && count(/<button type="button" aria-label="Телеграм">/g) === 1 && count(/aria-label="ВКонтакте"/g) === 1 && count(/aria-label="YouTube"/g) === 1, 'В подвале должны быть кнопки-иконки Телеграм, ВКонтакте и YouTube');

console.log('✓ Smoke tests passed: structure, placeholders, no-endpoint forms, interactions and mobile styles.');
