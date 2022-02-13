class GameMap extends AcGameObject
{
    constructor(playground)
    {
        super(); // ���û���Ĺ��캯��

        this.playground = playground; // ���Map���������playground��
        this.$canvas = $(`<canvas></canvas>`); // canvas�ǻ���
        this.ctx = this.$canvas[0].getContext('2d'); // ��ctx��������canvas

        this.ctx.canvas.width = this.playground.width; // ���û����Ŀ��
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
        this.render(); // �����ͼҪһֱ��һֱ���������Ļ���ԭ��
    }

}
