class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
                        单人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
                        多人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-setting">
                        设置
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-play-music">music</div>
                </div>
            </div>
        `);
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode')
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode')
        this.$setting = this.$menu.find('.ac-game-menu-field-item-setting')
        this.$play = this.$menu.find('.ac-game-menu-field-item-play-music')
        //this.$music = this.$menu.find('bigmusic');
        this.flag = false;
        this.start();
    }
    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function () {
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function () {
            console.log('click multi-mode');
        });
        this.$setting.click(function () {
            console.log('click setting');
        });
        this.$play.click(function () {
            var bgSound = document.getElementById("bgMusic");
            if (!this.flag) {
                bgSound.play();
                this.flag = true;
            } else {
                bgSound.pause();
                this.flag = false;
            }
        })
    }

    show() { // 显示menu界面
        this.$menu.show();
    }

    hide() { // 关闭menu界面
        this.$menu.hide();
    }
}
let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_statrt = false; // 是否执行过start函数
        this.timedelta = 0; //距离上一帧的时间

    }
    start() { //只会在第一帧执行
    }

    update() { //每一帧均会执行一此
    }

    on_destory() { //销毁的时候执行一次
        //
    }

    destroy() {
        this.on_destory()
        for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }

}

let last_timestamp; // 上一帧的时间
let AC_GAME_ANIMATION = function (timestamp) {

    for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION)
class GameMap extends AcGameObject
{
    constructor(playground)
    {
        super(); // ???û????Ĺ??캯??

        this.playground = playground; // ????Map??????????playground??
        this.$canvas = $(`<canvas></canvas>`); // canvas?ǻ???
        this.ctx = this.$canvas[0].getContext('2d'); // ??ctx????????canvas

        this.ctx.canvas.width = this.playground.width; // ???û????Ŀ???
        this.ctx.canvas.height = this.playground.height; // ???û????ĸ߶?

        this.playground.$playground.append(this.$canvas); // ?????????????뵽????playground
    }

    render()
    {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // ??????ɫ????Ϊ͸???ĺ?ɫ
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // ???ϸ??????????ľ???
    }

    start()
    {

    }

    update()
    {
        this.render(); // ??????ͼҪһֱ??һֱ?????????Ļ???ԭ????
    }

}
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
}class AiPlayer extends AcGameObject {
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
        // 画圆的方法，请照抄，深入了解同样自行查阅菜鸟教程
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
}class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.x = x;
        this.y = y;
        this.vx = 1;
        this.vy = 1;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.firction = 0.9;
        this.cur_skill = null;
        this.spend_time = 0
    }

    start() {
        if (this.is_me) {
            this.add_listening_events();
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) {
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shot_fireball(e.clientX - rect.left, e.clientY - rect.top);
                }
                outer.cur_skill = null;
            }
        });
        $(window).keydown(function(e) {
            if (e.which === 81) {  // q
                outer.cur_skill = "fireball";
                return false;
            }
        });
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
        // ??Բ?ķ????????ճ????????˽?ͬ?????в??Ĳ????̳?
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
}class FireBall extends AcGameObject{
    constructor(playground,player,x,y,radius,vx,vy,color,speed,move_length,damage) {
        super();
        this.player = player;
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.radius = radius;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start() {

    }

    update() {
        if(this.move_length < this.eps) {
            this.destroy();
            return false;
        } else {
            let moved = Math.min(this.move_length,this.speed * this.timedelta / 1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }

        for(let i = 0;i < this.playground.players.length;i ++) {
            let player = this.playground.players[i];
            if(this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }
        this.render();
    }

    get_dist(x1,y1,x2,y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x,this.y,player.x,player.y);
        if(distance < this.radius + player.radius) {
            this.destroy();
            this.attack(player);
        }
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attack(angle,this.damage);
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        this.hide();

        this.start();
    }

    get_random_color() {
        let color = ["blue","blue","red","pink","green"];
        return color[Math.round(Math.random() * 4)];
    }

    start() {
    }

    show() {  // 打开playground界面
        this.$playground.show();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this,this.width / 2,this.height / 2,this.height * 0.05,"white",this.height * 0.2,true));
        for(let i = 0;i < 5;i ++) {
            this.players.push(new AiPlayer(this,this.width / 2,this.height / 2,this.height * 0.05,this.get_random_color(),this.height * 0.2));
        }
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}
export class AcGame {
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#'+id);
        this.menu = new AcGameMenu(this)
        this.playground = new AcGamePlayground(this);
        this.start();
    }

    start() {
    }
}
