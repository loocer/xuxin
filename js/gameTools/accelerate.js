import DataBus from '../main/databus'
import Player from '../player/index'


const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
import {
  speedIcon
} from '../utils/common'

let databus = new DataBus()
const PLAYER_WIDTH = 30
const PLAYER_HEIGHT = 30
export default class Boom {
  constructor(x, y) {
    this.player = new Player()
  }
  init( x, y) {
    // 玩家默认处于屏幕底部居中位置
    // this.x = 100
    this.x = x
    this.speedIcon = speedIcon()
    this.name='accelerate'
    this.y = y
    this.visible = true
    this.isBoom = false
    this.boomTime = 1
    this.maxBoomTime = 1e3//最大爆炸范围
    this.width = PLAYER_WIDTH
    this.height = PLAYER_HEIGHT
  }
  drawToCanvas(ctx) {
      ctx.save()
      ctx.translate(this.x, this.y)
      if (databus.frame % 40 < 20) {
        ctx.scale(databus.frame % 20 / 20, databus.frame % 20 / 20);
      }
      ctx.drawImage(
        this.speedIcon,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      )
      ctx.restore()
  }
  checkIsFingerOnAir() {
    let l = Math.sqrt(Math.pow((this.x - this.player.x), 2) + Math.pow((this.y - this.player.y), 2))
    return l < Math.abs(this.width + this.player.width);
  }
  update() {
    if (!this.visible)
      return 
    if (this.checkIsFingerOnAir()) {
      databus.bulletClass =  {
        name: 'bullet3',
      }
      this.visible = false
      databus.pools.recover(this.name, this)
    }
  }
}

