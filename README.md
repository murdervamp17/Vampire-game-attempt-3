# VAMPRE (sandbox v0.2)
Side-view pixel-horror. You're a vampire test subject escaping an underground lab. Feed to evolve.

## Play
- Live: `https://<your-username>.github.io/<repo>/` (after first deploy)
- Or download the release zip, unzip, open `index.html`.

## Controls
A/D move | W/Space jump, hold to FLY (unlocks at 10 XP) | LMB hold: telekinesis, drag humans in to feed |
Shift/RMB: vampiric dash toward cursor (unlocks at 25 XP) | 1/2/3 spend upgrade points (TK/Feed/Dash)
Crates: grab with LMB, release to throw; smash bulkheads with thrown crates or dashes.
Sandbox: X = +10 XP, G = god mode.

## Evolution (total 100 XP)
0 Test Subject (0) -> 1 Awakened (10, flight) -> 2 Stalker (25, dash) -> 3 Nightborn (45, spines) -> 4 Apex (70, wings) -> 5 Primordial (100, horns).

## Ship it
1. Create a GitHub repo, push these files to `main`.
2. Settings > Pages > Source: **GitHub Actions**.
3. Release: `git tag v0.1.0 && git push --tags` -> workflow deploys Pages and attaches the zip to a GitHub Release.

## Android APK
Every push to `main` builds `vampre.apk` (Actions tab > latest run > Artifacts). Tagged releases (`v*`) attach it to the GitHub Release.
Install: download the APK to your phone, allow "install unknown apps", open it. It is a debug-signed build, fine for testing.
Touch: left thumb = move (drag up = jump/fly), tap/hold the world = telekinesis, FLY and DASH buttons bottom-right, yellow buttons = spend upgrade points.
