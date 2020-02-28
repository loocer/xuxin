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
    super(IMG[1], BULLET_WIDTH, BULLET_HEIGHT)
    this.player = new Player()
  }
  init(x, y) {
    this.name = 'bullet3'
    this.zx = x
    this.zy = y
    // this.img = GAME_IMG.get('bullets')[0]
    this.x = x
    this.y = y
    this.showLength = 0
    this.stopFlag = false
    databus.createSpeed = 5
    this.moveX = databus.shootX
    this.moveY = databus.shootY
    this.speed = 20
    this.points = []
    this.visible = true
    this.player.fireStyleFoo= ()=>{
      if (this.player.fireAcTime != 0) {
        this.player.fireAcTime = 0
      }else{
        this.player.fireAcTime = 2
      }
    }
    // this.mucsic()
  }
  mucsic() {
    this.audio = wx.createInnerAudioContext()
    // this.audio.autoplay = true
    this.audio.volume = 0
    this.audio.src = 'audio/8102_2020-02-27-19-33-51.mp3'
    this.audio.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    this.audio.play()
    this.audio.onEnded(()=>{
      this.audio.destroy()
    })
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
        0, this.height/2+this.showLength,
        10, this.height,
        -this.width / 2,
        0,
        this.width,
        length
      )
    } else {
      ctx.drawImage(
        this.img,
        0, this.height/2,
        10, this.height,
        -this.width / 2,
        0,
        this.width,
        length
      )
    }
    ctx.restore()
   
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
  }
}