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
    this.name='mosterHouse'
  }
  init(x,y ) {
    // 玩家默认处于屏幕底部居中位置
    this.x = x
    this.speedIcon = GAME_IMG.get('houseIcon')
    this.y = y
    this.value = 1000
    this.createTime = 100
    this.visible = true
    this.width = PLAYER_WIDTH
    this.height = PLAYER_HEIGHT
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
  }
  update(player) {
    if (!this.visible)
      return 
    if (databus.frame%this.createTime==0) {
      let enemy = databus.pools.getItemByClass('enemy1', Enemy)
      enemy.init(this.x,this.y)
      databus.enemys.add(enemy)
      this.value--
    }
    if (this.value==0) {
      this.visible = false
      databus.pools.recover(this.name, this)
    }
  }
}

