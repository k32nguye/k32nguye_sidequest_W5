const GLOBAL_MESSAGES = [
  "an orb?",
  "hi there :)",
  "another orb...",
  "stay here for 3 seconds",
  "go go go",
  "please give me some space",
  "how many orbs are there??",
  "oh no i've been found",
];
class WorldLevel {
  constructor(json) {
    this.schemaVersion = json.schemaVersion ?? 1;

    this.w = json.world?.w ?? 2400;
    this.h = json.world?.h ?? 1600;
    this.bg = json.world?.bg ?? [235, 235, 235];
    this.gridStep = json.world?.gridStep ?? 160;

    this.obstacles = json.obstacles ?? [];
    this.stars = json.stars ?? []; //loads new stars array

    // NEW: camera tuning knob from JSON (data-driven)
    this.camLerp = json.camera?.lerp ?? 0.12;
  }

  drawBackground() {
    background(220);
  }

  drawWorld(camX, camY) {
    noStroke();
    fill(this.bg[0], this.bg[1], this.bg[2]);
    rect(0, 0, this.w, this.h);

    stroke(20, 20, 40);
    for (let x = 0; x <= this.w; x += this.gridStep) line(x, 0, x, this.h);
    for (let y = 0; y <= this.h; y += this.gridStep) line(0, y, this.w, y);

    noStroke();
    fill(170, 190, 210);
    for (const o of this.obstacles) rect(o.x, o.y, o.w, o.h, o.r ?? 0);

    // draw stars with glow effect
    noStroke();
    let camCenterX = camX + width / 2;
    let camCenterY = camY + height / 2;

    for (const s of this.stars) {
      // distance from camera centre to star
      let d = dist(s.x, s.y, camCenterX, camCenterY);

      // messages
      if (d < 75) {
        // choose a message once per orb
        if (!s.finalmsg) {
          s.finalmsg = random(GLOBAL_MESSAGES); // global pool
        }

        push();
        textAlign(CENTER);
        fill(255);
        textSize(18);
        text(s.finalmsg, s.x, s.y - 35);
        pop();
      }

      // brightness: closer = brighter // 0–300 px range: bright → dim
      let alpha = map(d, 0, 200, 255, 0, true);

      // star size + pulse effect when camera approaches star
      // when camera is close -> star size = 45
      // when camera is far -> star size = 25
      let size = map(d, 0, 300, 45, 25, true);

      let baseSize = s.size ?? size; // use JSON size or dynamic size

      // pick a random color for each orb
      let r = s.r ?? random(100, 255);
      let g = s.g ?? random(100, 255);
      let b = s.b ?? random(100, 255);

      // store the color so it doesn't change every frame
      s.r = r;
      s.g = g;
      s.b = b;

      // soft glow around star
      noStroke();
      fill(r, g, b, alpha * 0.25);
      circle(s.x, s.y, baseSize * 2.5);

      // glow + orb drawing here // circle(s.x, s.y, size);

      fill(r, g, b, alpha); // golden yellow colour
      circle(s.x, s.y, baseSize); // medium star
    }
  }

  drawHUD(player, camX, camY) {
    noStroke();
    fill(255);
    text("Lost in Space 🛰️", width / 2, 35);
    textAlign(CENTER);
    text(
      "  Player: " +
        (player.x | 0) +
        "," +
        (player.y | 0) +
        "  Cam: " +
        (camX | 0) +
        "," +
        (camY | 0),
      width / 2,
      55,
    );
  }
}
