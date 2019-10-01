let walls = [];
let ray;
let particle;

const sceneW = 400;
const sceneH = 400;

function setup() {
    createCanvas(800, 400);
    for(let i = 0; i < 5; i++) {
        const x1 = random(sceneW);
        const x2 = random(sceneW);
        const y1 = random(sceneH);
        const y2 = random(sceneH);
        walls[i] = new Boundary(x1, x2, y1, y2);
    }
    walls.push(new Boundary(0, 0, 0, sceneH));
    walls.push(new Boundary(sceneH, 0, 0, 0));
    walls.push(new Boundary(0, sceneW, sceneH, sceneW));
    walls.push(new Boundary(sceneW, 0, sceneH, sceneW));
    
    particle = new Particle();
}

function draw() {
    if(keyIsDown(LEFT_ARROW)) {
        particle.rotate(0.01);
    } else if(keyIsDown(RIGHT_ARROW)) {
        particle.rotate(-0.01);
    }

    background(0);
    for(let wall of walls) {
        wall.show();
    }

    particle.update(mouseX, mouseY);
    particle.show();

    const scene = particle.look(walls);
    const w = sceneW / scene.length;
    push();
    translate(sceneW, 0);
    for(let i = 0; i < scene.length; i++) {
        noStroke();
        const sq = scene[i] * scene[i];
        const wSq = sceneW * sceneW;
        const b = map(sq, 0, wSq, 255, 0);
        const h = map(scene[i], 0, sceneW, sceneH, 0);
        fill(b);
        rectMode(CENTER);
        rect(i * w + w / 2, sceneH / 2, w + 1, h);
    }
    pop();
}