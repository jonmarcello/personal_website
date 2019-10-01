class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.obstacle = false;
        this.start = false;
        this.end = false;

        this.gCost = null;
        this.hCost = null;
        this.fCost = () => this.gCost + this.hCost;

        this.array = () => [this.x, this.y]

        this.parent = null;
    }
}