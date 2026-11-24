# Asset credits

All third-party assets below are CC0 (public domain). Credit is given anyway. Everything was fetched and
converted with the arena's free `asset-forge` tool chain; the Blender models in `assets/models/` were built from
the scripts in `assets/src/` by Claude Fable 5.1 and are MIT like the rest of the game.

- **Sandstone Cracks** (Poly Haven, CC0) by Rob Tuytel: https://polyhaven.com/a/sandstone_cracks  
  files: assets/textures/tuff_detail.jpg (greyscale, low-contrast detail map), assets/textures/tuff_normal.jpg
- **Grass Ground** (Poly Haven, CC0) by Charlotte Baglioni: https://polyhaven.com/a/grass_ground  
  files: assets/textures/grass_detail.jpg (greyscale, low-contrast detail map)
- **Aerial Sand** (Poly Haven, CC0) by Rob Tuytel: https://polyhaven.com/a/aerial_sand  
  files: assets/textures/sand_detail.jpg (greyscale, low-contrast detail map)
- **Qwantani Dawn (Pure Sky)** (Poly Haven, CC0) by Greg Zaal, Jarod Guest: https://polyhaven.com/a/qwantani_dawn_puresky  
  files: assets/sky/qwantani_dawn_puresky_512.hdr (1k HDRI downscaled to 512x256, used for the High-tier environment lighting)
- **Kenney Impact Sounds** (Kenney, CC0) by Kenney (kenney.nl): https://kenney.nl/assets/impact-sounds  
  files: assets/sfx/putt.mp3 (impactWood_light_000), assets/sfx/wall.mp3 (impactWood_medium_000), assets/sfx/obstacle.mp3 (impactSoft_heavy_000), assets/sfx/cup.mp3 (impactTin_medium_000)
- **Kenney Interface Sounds** (Kenney, CC0) by Kenney (kenney.nl): https://kenney.nl/assets/interface-sounds  
  files: assets/sfx/click.mp3 (click_001), assets/sfx/back.mp3 (back_001)
- **Fredoka** (Google Fonts, SIL Open Font License 1.1) by Milena Brandão, Jeff Kellem:
  https://fonts.google.com/specimen/Fredoka  
  files: assets/fonts/fredoka-latin.woff2, assets/fonts/fredoka-latin-ext.woff2 (variable 400-700, Google Fonts subsets; the UI type of the 2026-11 redesign)

## Stil 3D (24.11.2026): the song video's chibi look

- `assets/3d/golfcu-nisan.webp`, `golfcu-sevinc.webp`, `peri.webp`, `bayrak.webp`: one 2x2 sprite sheet made with the
  Gemini app (Nano Banana) from a text prompt describing the Peri Golf song video's characters (kid golfer with the
  pottery-pattern putter, the fairy, the red hole flag); white background removed and cut locally (PIL + scipy).
- `assets/3d/kil-detay.webp`, `cimen-detay.webp`: detail maps cut from a frame of the game's own song video (fairy-chimney
  clay and putting green), high-passed and mirrored into seamless tiles locally. They replace tuff_detail.jpg and
  grass_detail.jpg in the game (those files stay in the repo, unused except the tuff normal map).

## Cila (24.11.2026)

- The four sprite webps in `assets/3d/` were defringed locally (alpha matte eroded about 1 px and feathered, edge colour taken from the
  nearest solid pixel; PIL + scipy). No new images were generated.
