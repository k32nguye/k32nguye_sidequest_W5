class Player {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.s = speed ?? 3;
  }

  updateInput() {
    const dx =
      (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) -
      (keyIsDown(LEFT_ARROW) || keyIsDown(65));

    const dy =
      (keyIsDown(DOWN_ARROW) || keyIsDown(83)) -
      (keyIsDown(UP_ARROW) || keyIsDown(87));

    const len = max(1, abs(dx) + abs(dy));
    this.x += (dx / len) * this.s;
    this.y += (dy / len) * this.s;
  }

  draw() {
    push();
    translate(this.x, this.y);

    // rotation speed
    rotate(frameCount * 0.02);

    // outer glow
    noStroke();
    fill(180, 200, 255, 60);
    rectMode(CENTER);
    rect(0, 0, 10, 50, 1);

    // inner rotating shape
    fill(220, 240, 255);
    rect(0, 0, 22, 20, 4);

    pop();
  }
}
