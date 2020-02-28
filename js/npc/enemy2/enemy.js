import Animation from '../../base/animation'
import DataBus from '../../main/databus'
import Corpses from '../corpses.js'
import Player from '../../player/index'
import {
  getRoteImg
} from '../../utils/tools'
import {
  bleed1,
  bleed2,
  del1s2,
  bihu,
  duobi,
  GAME_IMG,
} from '../../utils/common'
// const ENEMY_WIDTH = 20
// const ENEMY_HEIGHT = 20

let databus = new DataBus()
export default class Enemy extends Animation {
  constructor(WIDTH = 40, HEIGHT = 40) {
    super("", WIDTH, HEIGHT)
  }
  init(x, y,li=10) {
    this.x = x
    this.y = y
    this.name = 'enemy2'
    // this.srcImg = srcImg
    this.imgs = GAME_IMG.get('yellow_bugs')
    // this.img.src = imgSrc
    this.del1s = bleed2
    this.time = 0
    this.finIndex = 0
    this.frame = 0
    this.stopTime = 0
    this.findTime = 0 //停留休息时间
    this.frameSpeed = 1
    this.score = 10
    this.allLive =li
    this.lifeValue = this.allLive
    this.speed = .2
    this.visible = true
    this.onlive = true
  }

  playOvers() {
    let corpses = databus.pools.getItemByClass('corpses', Corpses)
    corpses.init(this.x, this.y)
    databus.corpses.add(corpses)
  }
  getPosition() {
    let player = this.player
    let px = player.x + player.width / 2
    let py = player.y + player.height / 2
    let lpx = Math.abs(this.x - player.x)
    let lpy = Math.abs(this.y - player.y)
    let tempx = 0
    let tempy = 0
    if (lpx > lpy) {
      tempx = player.x > this.x ? this.x + this.speed : this.x - this.speed
      tempy = player.y > this.y ? this.y + lpy / lpx : this.y - lpy / lpx
    } else {
      tempy = player.y > this.y ? this.y + this.speed : this.y - this.speed
      tempx = player.x > this.x ? this.x + lpx / lpy : this.x - lpx / lpy
    }
    this.x = tempx
    this.y = tempy
    getRoteImg({
        x1: this.x,
        x2: player.x,
        y1: this.y,
        y2: player.y
      },
      this
    )


  }
  drawLive(ctx) {
    let start = this.x - this.width / 6
    let end = this.x + this.width / 6
    let length = (end - start)*(this.lifeValue/this.allLive)
    let standY = this.y + this.height /4

    ctx.beginPath();
    ctx.moveTo(start, standY); //设置起点状态
    ctx.lineTo(end, standY); //设置末端状态
    ctx.lineWidth = 2; //设置线宽状态
    ctx.strokeStyle = '#fff'; //设置线的颜色状态
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(start, standY); //设置起点状态
    ctx.lineTo(start + length, standY); //设置末端状态
    ctx.lineWidth = 2; //设置线宽状态
    ctx.strokeStyle = '#2CA298'; //设置线的颜色状态
    ctx.stroke();
  }
  drawToCanvas(ctx) {
    if (!this.visible)
      return
    this.drawLive(ctx)  
    let index = ~~this.frameSpeed
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotate + 180) * Math.PI / 180)
    ctx.drawImage(
      this.imgs[index], -this.width / 2, -this.height / 2,
      this.width,
      this.height
    )
    ctx.restore()
  }
  getFrameTimeFlag() {
    if (!this.player) {
      return true
    }
    return (Math.abs(this.x - this.player.x) +
      Math.abs(this.y - this.player.y)) > 10

  }
  findTool(player) {
    this.player = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    }
  }
  isCollideWith(sp) {
    let spX = sp.x
    let spY = sp.y
    let tX = this.x
    let tY = this.y
    if (!this.visible || !sp.visible)
      return false
    return (
      Math.sqrt((spX - tX) * (spX - tX) +
        (spY - tY) * (spY - tY)) < 20
    )
    // return !!(   spX >= this.x
    //           && spX <= this.x + this.width
    //           && spY >= this.y
    //           && spY <= this.y + this.height  )
  }
  // 每一帧更新子弹位置
  update(player) {
    if (!this.visible)
      return
    if (this.time == 0) {
      this.player = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
      }
    }
    this.time++
    if (this.time % 300 < this.stopTime) {
      return
    }
    this.findTool(player)

    if (!this.getFrameTimeFlag()) {
      return
    }


    this.frame++
    if (this.frame % 1 == 0) {
      this.frameSpeed += .5
      if (this.frameSpeed > this.imgs.length - 1) {
        this.frameSpeed = 0
      }
    }
    this.getPosition()
  }
}