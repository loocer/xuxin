
import DataBus from '../main/databus'
import {
  rnd
} from '../utils/tools'
import {
  biHuBody
} from '../utils/common.js'
import {
  bleed1,
  bleed2,
  del1s2,
  bihu,
  duobi,
  GAME_IMG,
} from '../utils/common'


let dataBus = new DataBus()

export default class Corpses {
  constructor() {
    this.name="corpses"
    // console.log(del1s)

  }
  init(X, Y) {
    this.frame = 0
    this.atlas = bleed1[0]
    this.showLong = 100
    this.visible = true
    this.bodyPicS = biHuBody
    this.rote = rnd(0, 360)
    this.x = X
    this.y = Y
    this.Bodys = []
    this.initBody()
  }
  initBody() {
    for (let i = 0; i < 4; i++) {
      let fuDu = rnd(0, 360)
      let maxR = rnd(0, 50)
      let height = rnd(0, 1) ? 0 : 30
      let width = rnd(0, 5) * 30
      let size = rnd(10, 25)
      this.Bodys.push([fuDu, maxR, height, width, size])
    }
  }
  renderBody(ctx) {
    for (let i = 0; i < 4; i++) {
      let obj = this.Bodys[i]
      let fud = obj[0]
      let banging = null
      banging = this.frame * 2 < obj[1] ? this.frame * 2 : obj[1]
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(obj[0] * Math.PI / 180)
      let x = 0 + banging * Math.cos(fud)
      let y = 0 + banging * Math.sin(fud)
      let size = obj[4]
      ctx.drawImage(
        this.bodyPicS,
        0, 0, obj[2], obj[3],
        x,
        y,
        size, size
      )
      ctx.restore()
      if (this.frame * 2 > 50) {
        let temp = [
          this.x,this.y,
          obj[0],
          null,
          0, 0, this.Bodys[i][2], this.Bodys[i][3],
          x,
          y,
          size
        ]
        dataBus.deedBady.push(temp)
      }
    }
    if (this.frame * 2 >50) {
      this.visible = false
      dataBus.pools.recover('corpses', this)
      let obj = [
        this.x,this.y,
        this.rote,
      ]
      dataBus.bleedBgs.push(obj)
    }
  }
  renderBleed(ctx){
    let temp =this.frame
    let size = temp>30?30:temp
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rote) * Math.PI / 180)
    ctx.drawImage(
      this.atlas,
      0, 0, 100, 100,
      -size/2,
      -size/2,
      size, size
    )
    ctx.restore()
  }
  drawToCanvas(ctx) {
    this.renderBleed(ctx)
    this.renderBody(ctx)
  }
  update() {
    if (!this.visible)
      return 
    this.frame++
    // console.log(this.del1s, ~~(this.frame / 10), '-------------', this.del1s[~~(this.frame / 10)])
    // this.atlas = this.del1s[~~(this.frame/8)]
    if (this.frame > this.showLong) {
      this.visible = false
      dataBus.pools.recover('corpses', this)
    }
  }
}