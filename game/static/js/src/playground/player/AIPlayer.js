class AiPlayer extends AcGameObject {
    constructor(playground, x, y, radius, color, speed) {
        super();
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.eps = 0.1;
        this.firction = 0.9;
        this.cur_skill = null;
        this.spend_time = 0
    }

    start() {
    }

    shot_fireball(tx, ty) {
        let x = this.x;
        let y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
        this.cur_skill = null;
    }

    get_dist = function (x1, y1, x2, y2) {
        let dx = x1 - x2, dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);

        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attack(angle, damage) {
        this.radius -= damage;
        if (this.radius < 10) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;

        for(let i = 0;i < 10 + Math.random() * 10 ;i ++) {
            let x = this.x,y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle),vy = Math.sin(angle);
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Partcle(this.playground,x,y,radius,vx,vy,this.color,speed,move_length);
        }
    }

    update() {
        this.spend_time += this.timedelta / 1000;
        if( this.spend_time > 4 && Math.random() < 1.0 / 300.0) {
            let play = null;
            while(true) {
                play = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
                if(play !== this) {
                    break;
                }
            }
            let tx = play.x * play.speed * play.vx * this.timedelta / 1000;
            let ty = play.y * play.speed * play.vy* this.timedelta / 1000;
            this.shot_fireball(tx,ty);
        }
        if (this.damage_speed > this.eps) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000 * 0.3;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000 * 0.3;
            this.damage_speed *= this.firction;
        } else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }

        this.render();
    }

    render() {
        // ????????????????????????????????????????????????????????????????????????
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
    
    on_destory() {
        for(let i = 0;i < this.playground.players.length;i ++) {
            if(this.playground.players[i] === this) {
                this.playground.players.splice(i,1);
            }
        }
    }
}