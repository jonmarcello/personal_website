class Particle {
    constructor() {
        this.pos = createVector( width / 2, height / 2);
        this.rays = [];
        this.heading = 0;
        for(let a = -30; a < 30; a += 1) {
            this.rays.push(new Ray(this.pos, radians(a)));
        }
    }

    rotate(angle) {
        this.heading += angle;

        for(let i = 0; i < this.rays.length; i += 1) {
            this.rays[i].setAngle(radians(i) + this.heading);
        }
    }

    look(walls) {
        let lastRayRecord = null;
        let firstRecord = null;
        const scene = [];
        
        for(let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i]
            let closest = null;
            let record = Infinity;

            for(let wall of walls) {
                const pt = ray.cast(wall);
                if(pt) {
                    let d = p5.Vector.dist(this.pos, pt);
                    const a = ray.dir.heading() - this.heading;
                    if(!mouseIsPressed) {
                        d *= cos(a);
                    }
                    if(d < record) {
                        record = d;
                        closest = pt;
                    }
    
                }
            }

            if(closest) {
                line(this.pos.x, this.pos.y, closest.x, closest.y);

                if(lastRayRecord) {
                    // fill(100);
                    // triangle(this.pos.x, this.pos.y, closest.x, closest.y, lastRayRecord.x, lastRayRecord.y)
                }

                if(ray === this.rays[this.rays.length - 1] && firstRecord) {
                    // triangle(this.pos.x, this.pos.y, closest.x, closest.y, firstRecord.x, firstRecord.y)
                }
            }

            scene[i] = record;

            lastRayRecord = closest;
            if(ray == this.rays[0]) {
                firstRecord = closest;
            }
        }

        return scene;

    }

    update(x, y) {
        this.pos.set(x, y);
    }

    show() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, 4);
        for(let ray of this.rays) {
            ray.show();
        }
    }
}