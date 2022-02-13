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
