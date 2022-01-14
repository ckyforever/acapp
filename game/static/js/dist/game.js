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
                </div>
            </div>
            `);
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode')
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode')
        this.$setting = this.$menu.find('.ac-game-menu-field-item-setting')

        this.start();
    }
    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function() {
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function() {
            console.log('click multi-mode');
        });
        this.$setting.click(function() {
            console.log('click setting');
        });
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

    destroy() {
    for(let i = 0;i < AC_GAME_OBJECTS.length;i ++) {
            if(AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i,1);
                break;
            }
        }
    }

}

let last_timestamp; // 上一帧的时间
let AC_GAME_ANIMATION = function(timestamp) {
    
    for(let i = 0;i < AC_GAME_OBJECTS.length;i ++) {
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start) {
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
        super(); // ���û���Ĺ��캯��

        this.playground = playground; // ���Map���������playground��
        this.$canvas = $(`<canvas></canvas>`); // canvas�ǻ���
        this.ctx = this.$canvas[0].getContext('2d'); // ��ctx��������canvas

        this.ctx.canvas.width = this.playground.width; // ���û����Ŀ���
        this.ctx.canvas.height = this.playground.height; // ���û����ĸ߶�

        this.playground.$playground.append(this.$canvas); // ������������뵽���playground
    }

    render()
    {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // �����ɫ����Ϊ͸���ĺ�ɫ
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // ���ϸ���������ľ���
    }

    start()
    {

    }

    update()
    {
        this.render(); // �����ͼҪһֱ��һֱ���������Ļ���ԭ����
    }

}
class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.x = x;
        this.y = y;
        this.vx = 1;
        this.vy = 1;
        this.move_length = 0;
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;

    }

    start() {
        if (this.is_me) {
            this.add_listening_events();
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            if (e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
            }
        });
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

    update() {
        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = this.vy = 0;
        } else {
            let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
        this.render();
    }

    render() {
        // ��Բ�ķ��������ճ��������˽�ͬ�����в��Ĳ���̳�
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        //this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.player = [];
        this.player.push(new Player(this,this.width / 2,this.height / 2,this.height * 0.05,"white",this.height * 0.15,true));

        this.start();
    }

    start() {
    }

    show() {  // 打开playground界面
        this.$playground.show();
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