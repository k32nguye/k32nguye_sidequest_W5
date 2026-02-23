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

      // message
      if (d < 90) {
        push();
        textAlign(CENTER);
        fill(255);
        textSize(18);
        let msg = s.message || "an orb?";
        text(msg, s.x, s.y - 35);
        pop();
      }

      // brightness: closer = brighter // 0–300 px range: bright → dim
      let alpha = map(d, 0, 200, 255, 0, true);

      // star size + pulse effect when camera approaches star
      // when camera is close -> star size = 45
      // when camera is far -> star size = 25
      let size = map(d, 0, 300, 45, 25, true);

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
      circle(s.x, s.y, size * 2.5);

      // glow + orb drawing here // circle(s.x, s.y, size);

      fill(r, g, b, alpha); // golden yellow colour
      circle(s.x, s.y, size); // medium star
    }
  }

  drawHUD(player, camX, camY) {
    noStroke();
    fill(255);

    // text("Example 4 — JSON world + smooth camera (lerp).", 12, 20);
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
      25,
    );
  }
}
