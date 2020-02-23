import DataBus from '../main/databus'

import Player from '../player/index'
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
import {
  boom1,
  boomsImage,
  boomIcon
} from '../utils/common'
import {
  rnd
} from '../utils/index.js'
let databus = new DataBus()
const PLAYER_WIDTH = 20
const PLAYER_HEIGHT = 20
const esqk = [
  [20, 20],
  [-20, -20],
  [15, 15],
  [-15, -15],
  [10,10],
  [-10, -10],
  [5,5],
  [-5, -5],
  [2, 2],
  [-2, -2],
  [0, 0],
]
let instance
export default class Boom {
  constructor(x, y) {
    if ( instance )
      return instance
    instance = this

  }
  init(x, y) {
    this.x = x
    this.y = y
    this.name = 'boom'
    this.visible = true
    this.isBoom = false
    this.boomIcon = boomIcon()
    this.boom1 = boomsImage()
    this.boomTime = 1
    this.esqkTime = 0
    this.maxBoomTime = 200 //最大爆炸范围
    this.width = PLAYER_WIDTH
    this.height = PLAYER_HEIGHT
    this.player = new Player()
  }
  drawToCanvas(ctx) {
    if (!this.isBoom) { //will booming
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.drawImage(
        this.boomIcon, -this.width / 2, -this.height / 2,
        this.width,
        this.height
      )
      ctx.restore()
    } else { ////be booming
      if (this.esqkTime <= esqk.length) {
        let temp = esqk[this.esqkTime - 1]
        databus.etranspX = temp[0]
        databus.etranspY = temp[1]
        // databus.transpY += databus.transY
        // databus.transpX += databus.transX
      }
      ctx.save()
      ctx.translate(this.x, this.y)
      // for (let i in this.boom1) {
      let r = (this.boomTime * 2)

      if (this.boomTime < 100) {
        for (let i = 0; i < 20; i++) {
          ctx.rotate(rnd(0, 360) * Math.PI / 180)
          ctx.drawImage(
            this.boom1[rnd(0, 4)], -r / 2, -r / 2,
            r,
            r
          )
          // }
        }
      } else {
        for (let i = 0; i < (200 - this.boomTime)/5 ; i++) {
          ctx.rotate(rnd(0, 360) * Math.PI / 180)
          ctx.drawImage(
            this.boom1[rnd(2,4)], -r / 2, -r / 2,
            r,
            r
          )
          // }
        }
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
    }
    if (this.isBoom) {
      this.esqkTime++
      this.boomTime += 10
    }
    if (this.boomTime > this.maxBoomTime) {
      this.isBoom = false
      this.visible = false
      databus.pools.recover(this.name, this)
    }
  }
}