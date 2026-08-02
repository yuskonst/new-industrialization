import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const js = await readFile(new URL('../script.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

const expect = (condition, message) => assert.ok(condition, message);
const count = (pattern) => (html.match(pattern) || []).length;

expect(html.includes('id="loader"'), 'Экран загрузки отсутствует');
expect(html.includes('id="loaderText"'), 'Динамический текст логотипа отсутствует');
expect(count(/class="step"/g) === 10, 'Должно быть ровно 10 интерактивных шагов');
expect(count(/class="faq__item"/g) === 4, 'Должно быть 4 вопроса в FAQ');
expect(count(/data-video-slide/g) === 2, 'Должны быть подготовлены 2 видеослайда');
expect(count(/person-placeholder/g) >= 3, 'Нет резерва под PNG-портреты');
expect(html.includes('action=' ) === false, 'Форма не должна иметь endpoint в согласовательном макете');
expect(html.includes('required') && html.includes('Политика обработки персональных данных'), 'Форма должна содержать обязательное согласие');
expect(js.includes('event.preventDefault()'), 'Форма должна предотвращать передачу данных');
expect(js.includes('showModal()'), 'Интерактивная подсказка должна открываться в окне');
expect(css.includes('@media(max-width:760px)'), 'Отсутствует мобильный breakpoint');
expect(css.includes('prefers-reduced-motion'), 'Не учтено предпочтение уменьшенной анимации');

console.log('✓ Smoke tests passed: structure, placeholders, no-endpoint forms, interactions and mobile styles.');
