class Partcle extends AcGameObject {
    constructor(playground,x,y,radius,vx,vy,color,speed,move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.radius = radius;
        this.move_length = move_length;
        this.friction = 0.9;
        this.esp = 1;
    }

    start() {

    }

    update() {
        if(this.move_length < this.esp || this.speed < this.esp) {
            this.destroy()
            return false;
        }
        let moved = Math.min(this.move_length,this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        // 画圆的方法，请照抄，深入了解同样自行查阅菜鸟教程
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}