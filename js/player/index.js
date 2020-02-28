import DataBus from '../main/databus'
import * as common from '../utils/common'
import creatBox from '../bullet/index'
import Boom from '../gameTools/boom'
import {
  GAME_IMG,
  playerBg
} from '../utils/common'
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const PLAYER_WIDTH = 20
const PLAYER_HEIGHT = 20

let databus = new DataBus()
const bullets = [
  ['A', 'bullet1'],
  ['B', 'bullet2'],
  ['C', 'bullet3']
]
let instance
export default class Player {
  constructor(main) {
    if (instance)
      return instance

    instance = this
    this.width = PLAYER_WIDTH
    this.height = PLAYER_HEIGHT
    this.fireStyleFoo = null
    this.firePic = GAME_IMG.get('bullets')[2]
    this.bullets = []
    this.init()
    // 初始化事件监听
    // this.initEvent()
  }
  init() {
    this.visible = true
    this.x = databus.playTempX
    this.y = databus.playTempY
    this.shootX = 0
    this.shootY = 0
    this.fireStyleFoo = () => {
      if (this.fireAcTime != 0) {
        this.fireAcTime = 0
      } else {
        this.fireAcTime = 5
      }
    }
    this.fireAcTime = 0
    this.bg = playerBg()
    this.bodyImg = common.playerImag(1)
    this.lagImg1 = common.playerImag(2)
    this.lagImg2 = common.playerImag(3)
    this.fireImag = common.playerFire()
    this.lifeValue = 20
    this.allLifeValue = 20
    // this.x = 0
    // this.y = 0
    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false

    this.bullets = []
  }
  resetLife() {
    databus.gameOver = false
    this.lifeValue = this.allLifeValue
  }
  drawLive(ctx) {
    ctx.save()
    ctx.lineWidth = 2; //设置线宽状态
    ctx.translate(this.x, this.y)
    ctx.beginPath();
    ctx.strokeStyle = '#fff'; //设置线的颜色状态
    ctx.arc(0,0, 12, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore()
    if(this.lifeValue>0){
      ctx.save()
      ctx.lineWidth = 2; //设置线宽状态
      ctx.translate(this.x, this.y)
      ctx.beginPath();
      ctx.strokeStyle = '#3B99A6'; //设置线的颜色状态
      ctx.arc(0,0, 12, 0, 2 * Math.PI* (this.lifeValue / this.allLifeValue));
      ctx.stroke();
      ctx.restore()
    }
    
    // let start = this.x - this.width /2
    // let end = this.x + this.width /2
    // let length = (end - start) * (this.lifeValue / this.allLifeValue)
    // let standY = this.y + this.height/2+5

    // ctx.beginPath();
    // ctx.moveTo(start, standY); //设置起点状态
    // ctx.lineTo(end, standY); //设置末端状态
    // ctx.lineWidth = 2; //设置线宽状态
    // ctx.strokeStyle = '#fff'; //设置线的颜色状态
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(start, standY); //设置起点状态
    // ctx.lineTo(start + length, standY); //设置末端状态
    // ctx.lineWidth = 1.5; //设置线宽状态
    // ctx.strokeStyle = 'red'; //设置线的颜色状态
    // ctx.stroke();
  }
  drawToCanvas(ctx) {
    if (!this.visible)
      return
    this.drawLive(ctx)
    let bu = null
    if (databus.leftPositions.touched) {
      bu = databus.frame % 10 > 5 ? this.lagImg1 : this.lagImg2
    } else {
      bu = this.lagImg1
    }
    if (databus.rightPositions.touched && databus.frame % databus.createSpeed < 2) {
      this.fireStyleFoo()
    }
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotateBody * Math.PI / 180)
    // ctx.drawImage(
    //   this.bg,
    //   -15,
    //   -15,
    //  30,
    //   30
    // )
    ctx.drawImage(
      bu,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    )

    ctx.restore()

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotateLag * Math.PI / 180 + 45.15)
    ctx.drawImage(
      this.bodyImg,
      -this.width / 2 + this.fireAcTime,
      -this.height / 2,
      this.width,
      this.height
    )

    ctx.restore()
    if (this.fireAcTime != 0) {
      let px = this.x + 15 * Math.cos(this.rotateLag * Math.PI / 180 + 180.95)
      let py = this.y + 15 * Math.sin(this.rotateLag * Math.PI / 180 + 180.95)
      ctx.save()
      ctx.translate(px, py)
      ctx.rotate(this.rotateLag * Math.PI / 180)
      ctx.drawImage(
        this.firePic,
        -5,
        -10,
        10,
        20
      )
      ctx.restore()
    }
  }
  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(x >= this.x - deviation &&
      y >= this.y - deviation &&
      x <= this.x + this.width + deviation &&
      y <= this.y + this.height + deviation)
  }
  isplesCollideWith(sp) {
    let spX = sp.x
    let spY = sp.y

    if (!this.visible || !sp.visible)
      return false
    return (
      Math.sqrt((spX - this.x) * (spX - this.x) +
        (spY - this.y) * (spY - this.y)) < (sp.width / 3 + this.width / 3)
    )
  }
  goOnLive() {
    databus.time = 2
    databus.pageIndex = 2
    wx.onTouchMove(databus.moveHandler)
    this.resetLife()
    let boom = databus.pools.getItemByClass('boom', Boom)
    boom.init(this.x, this.y)
    databus.gameTools.add(boom)
  }
  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    let mx = databus.shootX
    let my = databus.shootY
    if (mx == 0 && my == 0) {} else {
      creatBox.get(bullets[databus.bulletClass][1])(this)
    }
  }
}