class AcGamePlayground {
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
