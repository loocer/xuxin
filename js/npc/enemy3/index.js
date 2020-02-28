import DataBus from '../../main/databus'
import Enemy from './enemy'


const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
import {
  GAME_IMG
} from '../../utils/common'
let databus = new DataBus()
const PLAYER_WIDTH = 60
const PLAYER_HEIGHT = 60
export default class Boom {
  constructor() {
    this.name = 'mosterHouse'
  }
  init({x, y,c=100,l=10,li=10}) {
    this.x = x
    this.speedIcon = GAME_IMG.get('houseIcon')
    this.y = y
    this.allAalue = l
    this.value = l
    this.createTime = c
    this.li = li
    this.visible = true
    this.width = PLAYER_WIDTH
    this.height = PLAYER_HEIGHT
  }
  drawlive(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.lineWidth=1;
    ctx.strokeStyle="red";
    ctx.beginPath();
    ctx.arc(0,0, 8, 0, this.value/this.allAalue*2 * Math.PI);
    ctx.stroke();
    ctx.restore()
  }
  drawToCanvas(ctx) {
    if (!this.visible)
      return
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.drawImage(
      this.speedIcon,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    )
    ctx.restore()
    this.drawlive(ctx)
  }
  update(player) {
    if (!this.visible)
      return
    if (databus.frame % this.createTime == 0) {
      let enemy = databus.pools.getItemByClass('enemy3', Enemy)
      enemy.init(this.x, this.y,this.li)
      databus.enemys.add(enemy)
      this.value--
    }
    if (this.value == 0) {
      this.visible = false
      databus.pools.recover(this.name, this)
    }
  }
}