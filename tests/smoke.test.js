const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');

test('conserva la clave de usuarios e historial', () => {
  assert.match(app, /sumasRestas_v5/);
  assert.match(app, /historial se conserva sin límite/);
});

test('multiplicación 1x1 no duplica el resultado', () => {
  assert.match(app, /const singleProduct=current\.mulSteps\.length===1/);
  assert.match(app, /if\(!singleProduct\)/);
});

test('multiplicaciones avanzan de forma progresiva', () => {
  assert.match(app, /function updateMultiplicationProgress/);
  assert.match(app, /data-mul-step/);
  assert.match(app, /data-mul-final/);
});

test('incluye práctica, examen, programas y objetivo diario', () => {
  assert.match(html, /Programar ejercicios/);
  assert.match(html, /Modo examen/);
  assert.match(html, /Programaciones guardadas/);
  assert.match(app, /Objetivo diario/);
});

test('la PWA mantiene los recursos esenciales', () => {
  for (const file of ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './icon-192.png', './icon-512.png']) {
    assert.ok(sw.includes(`'${file}'`), `Falta ${file} en la caché`);
  }
});

test('HTML carga estilos y lógica separados', () => {
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /src="app\.js"/);
  assert.doesNotMatch(html, /<style>/);
});
