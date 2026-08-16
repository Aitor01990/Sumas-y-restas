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
  assert.match(html, /Modo ejercicios/);
  assert.match(html, /Modo examen/);
  assert.match(html, /Programaciones guardadas/);
  assert.match(app, /Objetivo diario/);
});

test('V17 conserva ajustes por usuario y acceso adulto', () => {
  assert.match(html, /parentGateModal/);
  assert.match(html, /Bic/);
  assert.match(app, /ensureUserConfig/);
  assert.match(app, /programProfiles/);
  assert.match(app, /startConfiguredProgram/);
  assert.match(app, /toLowerCase\(\)!=='oli'/);
  assert.match(app, /settingsBtn'\)\.onclick=openParentGate/);
});

test('objetivos por sesión diaria y semanal', () => {
  assert.match(app, /registerCompletedSession\('practice'\)/);
  assert.match(app, /registerCompletedSession\('exam'\)/);
  assert.match(app, /completedSession\('practice','day'\)/);
  assert.match(app, /completedSession\('exam','week'\)/);
  assert.doesNotMatch(app, /settingsBlock\('daily'/);
});

test('la PWA mantiene los recursos esenciales', () => {
  for (const file of ['./', './index.html', './styles.css?v=17.7', './app.js?v=17.7', './manifest.webmanifest', './icon-192.png', './icon-512.png']) {
    assert.ok(sw.includes(`'${file}'`), `Falta ${file} en la caché`);
  }
});

test('HTML carga estilos y lógica separados', () => {
  assert.match(html, /href="styles\.css\?v=17\.7"/);
  assert.match(html, /src="app\.js\?v=17\.7"/);
  assert.doesNotMatch(html, /<style>/);
});

test('incluye apoyo voluntario externo sin compartir datos', () => {
  assert.match(html, /https:\/\/buymeacoffee\.com\/aitorcrea/);
  assert.match(html, /Seguirá siendo gratuita/);
  assert.match(html, /rel="noopener noreferrer"/);
});

test('muestra el estado sin conexión y conserva actualización al volver', () => {
  assert.match(html, /offlineBadge/);
  assert.match(app, /navigator\.onLine/);
  assert.match(app, /addEventListener\('offline'/);
  assert.match(app, /addEventListener\('online'/);
  assert.match(sw, /caches\.match/);
});
