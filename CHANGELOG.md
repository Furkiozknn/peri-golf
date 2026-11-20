# Değişiklik günlüğü

## v2.1 · Kasım 2026

Yeni
- **Başarımlar:** ana menüde ve duraklatma menüsünde "Başarımlar" düğmesi. Dokuz başarım: ilk delik, tam tur, par altı tur, tek vuruş, gizli yol, kestirme ustası (12 kestirme), üç yıldızlı delik, yıldız avcısı (36 yıldızın yarısı) ve günlük seri (3 gün). Hepsi oyunun zaten kaydettiği verilerden (en iyi tur, yıldızlar, kestirmeler, tek vuruş galerisi, günlük seri) hesaplanır; eski kayıtla açan oyuncu geçmiş ilerlemesini hemen görür. Delik ya da tur bitince yeni açılan başarım ekranda "★ Yeni başarım" olarak çıkar; eski kayıttan gelenler için bildirim yağmuru olmaz (yeni yerel anahtar: `arena.periGolf.ach`).
- **Yenilikler penceresi ve sürüm etiketi:** "Yenilikler" düğmesi ana menüde ve duraklatma menüsünde (yeni sürümde nokta ile işaretlenir; yeni yerel anahtar: `arena.periGolf.seenNews`). Sürüm "v2.1 · Kasım 2026" menünün altında yazar. İlk açılışta doğrudan oyuna giren oyuncular da pencereye duraklatma menüsünden ulaşır. Escape ile kapanır.
- **"Diğer oyunlar" bağlantısı:** ana menünün altında https://furkiozknn.github.io/ adresine giden bağlantı.

Düzeltme
- Açıklama (description, Open Graph, Twitter) Türkçe ve İngilizce birlikte yazıldı; paylaşım kartına `twitter:image`, görsel metni (`alt`), dil ve `canonical` eklendi.
- Sayfaya simge (SVG, ek istek yok) ve `theme-color` eklendi; daha önce simge yoktu.
- Bulunamayan adresler için `404.html` eklendi (oyuna ve diğer oyunlara bağlantı).
- Telefonda "Günün Meydan Okuması (seri 0 · en iyi 0)" düğmesi üç satıra taşıyordu; seri bilgisi düğmenin alt satırına düzgün sığıyor.
- `test/duman.mjs`: bağımlılık eklemeyen duman testi (sayfa açılışı, konsol hatası, vuruş, duraklatma, eski kayıtla açılış, telefon taşması, yeni pencereler).

Dokunulmayanlar: fizik, 12 delik, bot, kayıt anahtarları (`arena.periGolf.settings`, `.save`, `.best`, `perigolf.shortcuts`, `perigolf.aces`), oyun adresi ve dosya yolları, arena-kit/arena-core blokları. Eski kayıtla açılış denendi (bkz. `test/duman.mjs`).

## v2.0 · Kasım 2026

Fantastik minyatür diorama görünümü, tahta tabela arayüzü, isteğe bağlı CC0 varlık paketi ve arena-core v2 (ayrıntı: README).
