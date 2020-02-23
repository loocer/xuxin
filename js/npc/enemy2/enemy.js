import Animation from '../base/animation'
import DataBus from '../databus'
import Corpses from './corpses.js'
import {
  getRoteImg
} from '../utils/index'

// const ENEMY_WIDTH = 20
// const ENEMY_HEIGHT = 20

let databus = new DataBus()
let atlas = new Image()
atlas.src = 'images/on-fire.png'
export default class Enemy extends Animation {
  constructor(WIDTH=20, HEIGHT=20) {
    super("", WIDTH, HEIGHT)
    this.initExplosionAnimation()
  }
  setImage(imgs) {
    let temps = []
    for (let img of imgs) {
      let imgObj = new Image()
      imgObj.src = img
      temps.push(imgObj)
    }
    return temps
  }
  init(speed, lifeValue, x, y, imgSrcs, del1s, stopTime, findTime,finIndex,size=20) {
    this.x = x
    this.y = y
    // this.srcImg = srcImg
    this.imgs = imgSrcs
    // this.img.src = imgSrc
    this.del1s = del1s
    this.time = 0
    this.finIndex = finIndex
    this.frame = 0
    this.stopTime = stopTime //停留休息时间
    this.findTime = findTime //停留休息时间
    this.frameSpeed = 0
    this.width = size
    this.height = size
    this.score = lifeValue
    this.lifeValue = lifeValue
    this.speed = speed
    this.visible = true
    this.onlive = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    // let frames = []
    // const EXPLO_IMG_PREFIX  = 'images/explosion'
    // const EXPLO_FRAME_COUNT = 400
    // for ( let i = 0;i < EXPLO_FRAME_COUNT;i++ ) {
    //   // frames.push(EXPLO_IMG_PREFIX + 1 + '.png')
    //   frames.push('images/bg1.jpg')
    // }
    // // frames.push('images/bg1.jpg')
    // this.initFrames(frames)
  }
  playOvers() {
    let corpses = databus.pools.getItemByClass('corpses', Corpses)
    corpses.init(atlas, this.x, this.y, this.del1s)
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

    // console.log(this.rotate)
  }
  drawToCanvas(ctx) {
    if (!this.visible)
      return
    let index = ~~this.frameSpeed
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotate + 180) * Math.PI / 180)
    ctx.drawImage(
      this.imgs[index], -this.width / 2, -this.height / 2,
      this.width,
      this.height
    )
    // ctx.rect(-this.width / 2, -this.height / 2, this.width,this.height);

    // let x1 = -this.width / 2 + 50 * Math.cos(0)
    // let y1 = -this.height / 2 + 50 * Math.sin(0)
    // ctx.arc(0, 0, this.width/3, 0, 2 * Math.PI);
    // let x11 = -this.width / 2 + 50 * Math.cos(90)
    // let y11= -this.height / 2 + 50 * Math.sin(90)
    // ctx.arc(x11, y11, 10, 0, 2 * Math.PI);  
    // let x12 = -this.width / 2 + 50 * Math.cos(180)
    // let y12 = -this.height / 2 + 50 * Math.sin(180)
    // ctx.arc(x12, y12, 10, 0, 2 * Math.PI);
    // ctx.stroke();
    ctx.restore()
  }
  getFrameTimeFlag() {
    if (!this.player){
      return true
    }
    return (Math.abs(this.x - this.player.x) +
      Math.abs(this.y - this.player.y)) > 10

  }
  findTool1(player){
    if (~~(this.time % 300/100)==0) {
      this.player = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
      }
    }
    if (~~(this.time % 300 / 100) == 1) {
      this.player = {
        x: player.x,
        y: player.y + 100,
        width: player.width,
        height: player.height
      }
    }
    if (~~(this.time % 300 / 100) == 2) {
      this.player = {
        x: player.x + 150,
        y: player.y,
        width: player.width,
        height: player.height
      }
    }
  }
  findTool2(player) {
    if (~~(this.time % 300 / 100) == 0) {
      this.player = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
      }
    }
    if (~~(this.time % 300 / 100) == 1) {
      this.player = {
        x: player.x,
        y: player.y + 100,
        width: player.width,
        height: player.height
      }
    }
  }
  findTool3(player) {
    if (~~(this.time % 300 / 100)<2) {
      this.player = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
      }
    }
  }
  // 每一帧更新子弹位置
  update(player) {
    if (!this.visible)
      return
    if (this.time==0){
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
    if (this.finIndex==0){
      this.findTool1(player)
      }
    if (this.finIndex == 1) {
      this.findTool2(player)
    }
    if (this.finIndex == 2) {
      this.findTool3(player)
    }
    // this.findTool(player)
    if (!this.getFrameTimeFlag()) {
      return
    }
   

    this.frame++
    //   this.width = ENEMY_WIDTH + this.lifeValue * 4
    // this.height = ENEMY_HEIGHT + this.lifeValue * 4

    if (this.frame % 2 == 0) {
      this.frameSpeed++
        if (this.frameSpeed > this.imgs.length - 1) {
          this.frameSpeed = 0
        }
    }
    this.getPosition()
    // this.y += this.speed
    // 对象回收
    // if ( this.y > window.innerHeight + this.height )
    //   // databus.pools.recover('enemy', this)
    //   delete this
    //   // databus.removeEnemey(this)
  }
}