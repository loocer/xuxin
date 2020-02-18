import Sprite from '../../base/sprite'
import DataBus from '../../main/databus'
import * as tools from '../../utils/tools'

import {
  groundWidth,
  groundHeight,
  GAME_IMG
} from '../../utils/common'
const BULLET_WIDTH = 1
const BULLET_HEIGHT = 100

let databus = new DataBus()
export default class Bullet extends Sprite {
  constructor() {
    const IMG = GAME_IMG.get('bullets')

    super(IMG[1], BULLET_WIDTH, BULLET_HEIGHT)
  }
  init(x, y,mx,my) {
    this.name = 'bullet2'
    this.zx = x
    this.zy = y
    // this.img = GAME_IMG.get('bullets')[0]
    this.x = x
    this.y = y
    this.showLength = 0
    this.stopFlag = false
    // databus.createSpeed = 20
    this.moveX = mx
    this.moveY = my
    this.speed = databus.shootSpeed
    this.points = []
    this.visible = true
  }
  drawToCanvas(ctx) {
    if (!this.visible)
      return
    ctx.save()
    let length = Math.sqrt((this.x - this.zx) * (this.x - this.zx) + (this.y - this.zy) * (this.y - this.zy))
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotate * Math.PI / 180)
    if (this.stopFlag) {

      ctx.drawImage(
        this.img,
        0, this.showLength,
        10, this.height,
        -this.width / 2,
        0,
        this.width,
        length
      )
    } else {
      ctx.drawImage(
        this.img,
        -this.width / 2,
        0,
        this.width,
        length
      )
    }

    // ctx.beginPath();
    // ctx.lineWidth = 5;
    // ctx.arc(0, 0, 15+2 * this.lifeValue , 0, 2 * Math.PI);
    // ctx.stroke();
    ctx.restore()
    // if (!this.visible)
    //   return
    //   let gnt1 = ctx.createLinearGradient(this.zx,this.zx,this.x,this.y);//线性渐变的起止坐标
    //   gnt1.addColorStop(0,'rgba(255, 255, 255,0)');//创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色
    //   gnt1.addColorStop(1,'rgba(255, 255, 255,1)');
    // ctx.strokeStyle = gnt1;
    // ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.moveTo(this.zx, this.zy)
    // ctx.lineTo(this.x, this.y)
    // ctx.stroke();

    // ctx.globalAlpha = "1";
  }
  // 每一帧更新子弹位置
  update() {
    if (!this.visible)
      return
    if (this.stopFlag) {
      this.showLength+=4
    } else {
      tools.getRoteImg({
          x1: this.x + this.moveX,
          x2: this.x,
          y1: this.y + this.moveY,
          y2: this.y,
        },
        this
      )
      this.y += this.moveY * this.speed
      this.x += this.moveX * this.speed
    }
    // 超出屏幕外回收自身
    // console.log(this.points, '====================')
    if (this.y < 0 ||
      this.y > groundHeight ||
      this.x < 0 ||
      this.x > groundWidth
    ) {
      this.stopFlag = true
    }
    if (this.showLength == 100) {
      this.visible = false
      databus.pools.recover(this.name, this)
    }
    // databus.removeBullets(this)

    // delete this
  }
}