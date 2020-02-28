import Sprite from '../../base/sprite'
import DataBus from '../../main/databus'
import * as tools from '../../utils/tools'
import Player from '../../player/index'
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
    
    super(IMG[0], BULLET_WIDTH, BULLET_HEIGHT)
    this.player = new Player()
  }
  init(x, y) {
    this.name = 'bullet4'
    this.zx = x
    this.zy = y
    // this.img = GAME_IMG.get('bullets')[0]
    this.x = x
    this.y = y
    this.showLength = 0
    this.stopFlag = false
    this.stopFlagTemp = false
    databus.createSpeed = 10
    this.moveX = databus.shootX
    this.moveY = databus.shootY
    this.speed = 20
    this.points = []
    this.visible = true
    this.player.fireStyleFoo= ()=>{
      if (this.player.fireAcTime != 0) {
        this.player.fireAcTime = 0
      }else{
        this.player.fireAcTime = 5
      }
    }
  }
  
  // 每一帧更新子弹位置
  update() {
    if (!this.visible)
      return
    if (this.stopFlagTemp) {
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
    if (this.y < 0 ||
      this.y > groundHeight ||
      this.x < 0 ||
      this.x > groundWidth
    ) {
      this.stopFlagTemp = true
    }
    if (this.showLength == 100) {
      this.visible = false
      databus.pools.recover(this.name, this)
    }
    // databus.removeBullets(this)

    // delete this
  }
}