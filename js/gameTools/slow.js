import DataBus from '../main/databus'
import {normal, slow} from '../utils/tools'
import Player from '../player/index'
import {
  speedIcon,
  slowSpeed
} from '../utils/common'
import {
  rnd
} from '../utils/index.js'
let databus = new DataBus()
const PLAYER_WIDTH = 20
const PLAYER_HEIGHT = 20

let instance
export default class Slow {
  constructor(x, y) {
    if ( instance )
      return instance
    instance = this
    this.visible = false

  }
  init(x, y) {
    this.x = x
    this.y = y
    this.name = 'slow'
    this.visible = true
    this.isBoom = false
    this.boomIcon = speedIcon()
    this.boom1 = slowSpeed()
    this.boomTime = 1
    this.isEsqk = false
    this.isRset = false
    this.maxBoomTime = 800 //最大爆炸范围
    this.width = PLAYER_WIDTH
    this.height = PLAYER_HEIGHT
    this.player = new Player()
  }
  drawToCanvas(ctx) {
    if (!this.visible)
      return
    if (!this.isEsqk) { //will booming
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(180 * Math.PI / 180)
      ctx.drawImage(
        this.boomIcon, -this.width / 2, -this.height / 2,
        this.width,
        this.height
      )
      ctx.restore()
    } else { ////be booming
      
      ctx.save()
      ctx.translate(this.x, this.y)
      // for (let i in this.boom1) {
      let r = (this.boomTime * 2)

      if (this.boomTime < 1000) {
          ctx.rotate(rnd(0, 360) * Math.PI / 180)
          ctx.drawImage(
            this.boom1, -r / 2, -r / 2,
            r,
            r
          )
      }

      this.width = this.boomTime * 2
      this.height = this.boomTime * 2
      ctx.restore()
    }
  }
  checkIsFingerOnEnemy(enemy) {
    if (this.isBoom) {
      let l = Math.sqrt(Math.pow((this.x - enemy.x), 2) + Math.pow((this.y - enemy.y), 2))
      return l < (this.boomTime * 2) / 2 + enemy.width / 2 - 10;
    } else {
      return false
    }
  }

  checkIsFingerOnAir() {
    let l = Math.sqrt(Math.pow((this.x - this.player.x), 2) + Math.pow((this.y - this.player.y), 2))
    return l > this.player.width;
  }
  update() {
    if (!this.visible)
      return
    if (!this.checkIsFingerOnAir()) {
      this.isBoom = true
      this.isEsqk = true
    }
    if (this.isBoom) {
      this.boomTime += 30
    }
    if (this.boomTime > this.maxBoomTime/2) {
      slow()
      setTimeout(()=>{
        this.isRset = true
      },10000)
    }
    if(this.isRset){
      this.x = this.player.x
      this.y = this.player.y
      this.boomTime -=80
      if( this.boomTime< 500){
        normal()
      }
      if (this.boomTime <0) {
        this.isEsqk = false
        this.visible = false
        databus.pools.recover(this.name, this)
      }
    }
    if (this.boomTime > this.maxBoomTime) {
      this.isBoom = false
      // this.visible = false
      // databus.pools.recover(this.name, this)
    }
    
  }
}