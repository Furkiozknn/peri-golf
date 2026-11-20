// test/duman.mjs: duman testi. Sayfa acilir, konsolda hata yok, oyun baslar, bir vurus durumu degistirir,
// telefon gorunumunde tasma yok, eski kayitla acilis calisir, v2.1 ozellikleri (Yenilikler, Basarimlar) calisir.
// Kullanim:  node test/duman.mjs [--root <klasor>] [--label etiket]
//   PW_CHROMIUM=<tarayici exe yolu>   kurulu bir Chromium (yoksa playwright'in kendi tarayicisi)
//   PW_DIR=<klasor>                   playwright ya da playwright-core'un bulundugu node_modules
//   DUMAN_SHOTS=<klasor>              verilirse ekran goruntuleri oraya yazilir
// Hicbir bagimlilik depoya eklenmez. --root ile baska bir kopya (ornegin origin/main cikarimi) ayni testle denenir;
// v2.1'e ozgu kontroller "yeni-yok" etiketiyle yazilir ve eski surumde eksik sayilir (cikis kodunu etkilemez).
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const root = arg('--root', join(here, '..'));
const label = arg('--label', 'aday');
const shots = process.env.DUMAN_SHOTS; if (shots) mkdirSync(shots, { recursive: true });

async function loadPw() {
  const dirs = [process.env.PW_DIR, join(here, '..', 'tools', 'node_modules')].filter(Boolean);
  for (const d of dirs) for (const n of ['playwright', 'playwright-core']) {
    try { return createRequire(join(d, 'x.js'))(n); } catch (e) { /* sonraki */ }
  }
  try { return await import('playwright'); } catch (e) { /* yok */ }
  console.log('FAIL playwright bulunamadi (PW_DIR verin)'); process.exit(2);
}
const pw = await loadPw();
const chromium = pw.chromium || pw.default?.chromium;

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.gif': 'image/gif', '.glb': 'model/gltf-binary', '.hdr': 'application/octet-stream', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
const server = createServer((q, r) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p === '/') p = '/index.html';
  const f = normalize(join(root, p));
  if (!f.startsWith(normalize(root)) || !existsSync(f) || statSync(f).isDirectory()) { r.writeHead(404, { 'content-type': 'text/plain' }).end('404'); return; }
  r.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }).end(readFileSync(f));
});
await new Promise(res => server.listen(0, '127.0.0.1', res));
const base = `http://127.0.0.1:${server.address().port}`;

let fails = 0, yeniEksik = 0;
const ok = (name, cond, extra = '', yeni = false) => {
  if (cond) console.log(`ok   ${name}${extra ? ' ' + extra : ''}`);
  else if (yeni) { yeniEksik++; console.log(`yeni-yok ${name}${extra ? ' ' + extra : ''}`); }
  else { fails++; console.log(`FAIL ${name}${extra ? ' ' + extra : ''}`); }
};
// Three.js CDN'den gelir; dis kaynaklar (yazi tipi, sayac) bos 200 ile yanitlanir.
const IGN = /gc\.zgo\.at|goatcounter|fonts\.(googleapis|gstatic)/;
const browser = await chromium.launch({ headless: true, executablePath: process.env.PW_CHROMIUM || undefined, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

async function open(ctxOpts, path) {
  const ctx = await browser.newContext(ctxOpts);
  await ctx.route(IGN, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push('pageerror ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text()); });
  page.on('response', r => { if (r.status() >= 400 && !IGN.test(r.url())) errs.push(r.status() + ' ' + r.url()); });
  page.on('requestfailed', r => { if (!IGN.test(r.url())) errs.push('failed ' + r.url()); });
  const t0 = Date.now();
  await page.goto(base + path, { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction(() => window.periGolf && document.getElementById('b-play') && !document.getElementById('b-play').disabled, null, { timeout: 120000 });
  return { ctx, page, errs, ms: Date.now() - t0 };
}
const shot = (page, n) => shots ? page.screenshot({ path: join(shots, `${label}-${n}.png`) }) : null;
const phase = page => page.evaluate(() => window.periGolf.phase);

try {
  // ---- masaustu 1366x768
  const D = await open({ viewport: { width: 1366, height: 768 } }, '/?menu&lang=tr&noassets');
  const { page } = D;
  ok('sayfa aciliyor, baslik', /Peri Golf/.test(await page.title()), `(${await page.title()}) ${D.ms} ms`);
  ok('baslik ekraninda "Oyna" gorunur', await page.isVisible('#b-play'));
  await shot(page, 'baslik');
  const verText = await page.evaluate(() => document.getElementById('ver-line')?.textContent || '');
  ok('surum etiketi', /v2\.1 · (Kasım|November) 2026/.test(verText), `(${verText.trim()})`, true);
  ok('"Diger oyunlar" baglantisi', await page.evaluate(() => [...document.querySelectorAll('#ov-title a')].some(a => a.href === 'https://furkiozknn.github.io/')), '', true);
  const hasNews = await page.evaluate(() => !!document.getElementById('b-news'));
  ok('Yenilikler dugmesi', hasNews, '', true);
  if (hasNews) {
    ok('Yenilikler dugmesinde "yeni" noktasi', await page.evaluate(() => document.getElementById('b-news').classList.contains('has-new')), '', true);
    await page.click('#b-news');
    ok('Yenilikler penceresi acik, maddeler var', (await page.locator('#news-list li').count()) >= 3 && await page.isVisible('#ov-news'));
    await shot(page, 'yenilikler');
    await page.keyboard.press('Escape');
    ok('Escape menuye doner, nokta kalkar', await page.isVisible('#ov-title') && !(await page.evaluate(() => document.getElementById('b-news').classList.contains('has-new'))));
    await page.click('#b-ach');
    const n = await page.locator('#ach-list li').count();
    ok('Basarimlar penceresi', n >= 6 && await page.isVisible('#ov-ach'), `(${n} madde)`);
    await shot(page, 'basarimlar');
    await page.keyboard.press('Escape');
  }
  // ---- oyuna basla
  await page.click('#b-play');
  await page.waitForFunction(() => window.periGolf.phase === 'play' || window.periGolf.phase === 'intro', null, { timeout: 30000 });
  ok('oyun basliyor', ['intro', 'play'].includes(await phase(page)), `(${await phase(page)})`);
  await page.waitForFunction(() => window.periGolf.phase === 'play', null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(800);
  const s0 = await page.evaluate(() => ({ st: window.periGolf.strokes, ph: window.periGolf.phase }));
  await page.keyboard.down('Space'); await page.waitForTimeout(700); await page.keyboard.up('Space');
  await page.waitForTimeout(500);
  const s1 = await page.evaluate(() => ({ st: window.periGolf.strokes, ph: window.periGolf.phase }));
  ok('etkilesim: vurus sayildi', s1.st === s0.st + 1, `(vurus ${s0.st} -> ${s1.st}, faz ${s0.ph} -> ${s1.ph})`);
  await shot(page, 'oyun');
  await page.keyboard.press('p');
  await page.waitForTimeout(200);
  ok('duraklat (P)', await page.isVisible('#ov-pause'));
  await shot(page, 'duraklat');
  await page.keyboard.press('p');
  await page.waitForTimeout(200);
  ok('devam (P)', await page.isHidden('#ov-pause'));
  ok('masaustu konsol/ag hatasi yok', D.errs.length === 0, D.errs.join(' | '));
  const perf = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; const sz = performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || r.encodedBodySize || 0), 0); return { dcl: Math.round(n.domContentLoadedEventEnd), size: sz }; });
  console.log(`note masaustu: DOMContentLoaded ${perf.dcl} ms, alt kaynak ${(perf.size / 1024).toFixed(0)} KB, index.html ${(statSync(join(root, 'index.html')).size / 1024).toFixed(0)} KB`);
  await D.ctx.close();

  // ---- eski kayitla acilis
  const O = await open({ viewport: { width: 1366, height: 768 } }, '/?noassets');
  await O.page.evaluate(() => {
    localStorage.setItem('arena.periGolf.best', JSON.stringify({ total: 31, card: [3, 2, 3, 2, 4, 3, 2, 3, 2, 3, 2, 2], stars: 20, unlocked: 5, ghost: {}, holeBest: { 0: 2, 1: 2 } }));
    localStorage.setItem('arena.periGolf.settings', JSON.stringify({ master: 0.5, music: 0.5, sfx: 0.5, lang: 'en', quality: 'low' }));
  });
  await O.page.reload({ waitUntil: 'load' });
  await O.page.waitForFunction(() => window.periGolf && !document.getElementById('b-play').disabled, null, { timeout: 120000 });
  ok('eski kayit: dil korunur', (await O.page.evaluate(() => document.documentElement.lang)) === 'en');
  ok('eski kayit: en iyi satiri', /31/.test(await O.page.textContent('#best-line')), `(${(await O.page.textContent('#best-line')).trim()})`);
  const savedAfter = await O.page.evaluate(() => JSON.parse(localStorage.getItem('arena.periGolf.best')).unlocked);
  ok('eski kayit bozulmadi', savedAfter === 5);
  const ach = await O.page.evaluate(() => localStorage.getItem('arena.periGolf.ach'));
  ok('eski kayit: basarimlar sessizce sayildi (toast yagmuru yok)', !!ach && JSON.parse(ach).includes('course'), `(${ach})`, true);
  ok('eski kayit: Basarimlar ekrani eski ilerlemeyi gosterir', await (async () => { if (!(await O.page.$('#b-ach'))) return false; await O.page.click('#b-ach'); const on = await O.page.locator('#ach-list li.on').count(); await O.page.keyboard.press('Escape'); return on >= 3; })(), '', true);
  ok('eski kayit: hata yok', O.errs.length === 0, O.errs.join(' | '));
  await O.ctx.close();

  // ---- telefon 390x844, dokunmatik
  const M = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, '/?menu&lang=tr&noassets');
  const geo = async () => M.page.evaluate(() => {
    const W = innerWidth, bad = [], small = [];
    for (const b of document.querySelectorAll('button, a.btn, input')) {
      const r = b.getBoundingClientRect(); if (!r.width || !b.offsetParent) continue;
      if (r.left < -0.5 || r.right > W + 0.5) bad.push((b.id || b.textContent.trim().slice(0, 14)) + `[${Math.round(r.left)},${Math.round(r.right)}]`);
      if (r.height < 40) small.push((b.id || b.textContent.trim().slice(0, 12)) + ':' + Math.round(r.height));
    }
    return { over: document.documentElement.scrollWidth - W, bad, small };
  });
  let g = await geo();
  ok('telefon baslik: yatay tasma yok', g.over <= 0 && g.bad.length === 0, `(tasma ${g.over}, ${g.bad.join(',')})`);
  ok('telefon baslik: dokunma hedefleri >= 40 px', g.small.length === 0, `(${g.small.join(',')})`);
  await shot(M.page, 'tel-baslik');
  if (await M.page.evaluate(() => !!document.getElementById('b-news'))) {
    await M.page.tap('#b-news'); g = await geo();
    ok('telefon Yenilikler: tasma yok', g.over <= 0 && g.bad.length === 0, `(${g.bad.join(',')})`);
    await shot(M.page, 'tel-yenilikler');
    await M.page.tap('#b-news-back');
    await M.page.tap('#b-ach'); g = await geo();
    ok('telefon Basarimlar: tasma yok', g.over <= 0 && g.bad.length === 0, `(${g.bad.join(',')})`);
    await shot(M.page, 'tel-basarimlar');
    await M.page.tap('#b-ach-back');
  }
  await M.page.tap('#b-play');
  await M.page.waitForFunction(() => window.periGolf.phase === 'play', null, { timeout: 40000 }).catch(() => {});
  await M.page.waitForTimeout(800);
  g = await geo();
  ok('telefon oyun: yatay tasma yok', g.over <= 0 && g.bad.length === 0, `(tasma ${g.over}, ${g.bad.join(',')})`);
  ok('telefon oyun: dokunma hedefleri >= 40 px', g.small.length === 0, `(${g.small.join(',')})`);
  await shot(M.page, 'tel-oyun');
  await M.page.tap('#b-pause'); await M.page.waitForTimeout(300);
  g = await geo();
  ok('telefon duraklat: tasma yok', g.over <= 0 && g.bad.length === 0, `(${g.bad.join(',')})`);
  await shot(M.page, 'tel-duraklat');
  ok('telefon konsol/ag hatasi yok', M.errs.length === 0, M.errs.join(' | '));
  await M.ctx.close();
} catch (e) {
  fails++; console.log('FAIL beklenmeyen hata: ' + (e && e.stack || e));
} finally {
  await browser.close(); server.close();
}
console.log(`SONUC ${label}: ${fails ? 'BASARISIZ (' + fails + ' hata)' : 'TAMAM'}${yeniEksik ? `, v2.1'e ozgu ${yeniEksik} kontrol bu kopyada yok` : ''}`);
process.exit(fails ? 1 : 0);
