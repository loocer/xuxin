import DataBus from '../main/databus'
import Player from '../player/index'
import {
  bulletsIcon
} from '../utils/common'
import { rnd } from '../utils/tools'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

let instance
let databus = new DataBus()
const PLAYER_WIDTH = 20
const PLAYER_HEIGHT = 20
const bullets = [['A','bullet1'],['B','bullet2'],['C','bullet3']]
const changeBulletClass =function(){
  let rndTemp = rnd(0,bullets.length-1)
  console.log(rndTemp)
  let temp = bullets[rndTemp]
  if(temp[0]== databus.bulletClass[0]){
    changeBulletClass()
  }else{
    return temp
  }
}
export default class Boom { 
  constructor(x, y) {
    if ( instance )
      return instance
    instance = this
    this.player = new Player()
  }
  init( x, y) {
    // 玩家默认处于屏幕底部居中位置
    this.x = x
    this.speedIcon =   bulletsIcon()
    this.name='accelerate'
    this.y = y
    this.visible = true
    this.isBoom = false
    this.boomTime = 1
    
    this.bulletClass = bullets[rnd(0,bullets.length-1)]
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
      // ctx.fillStyle = '#000';
      // ctx.strokeStyle = '#000';
      ctx.font = "8px bold Times New Roman"      
      ctx.fillText(this.bulletClass[0], this.height/3,-this.height/3);
      ctx.restore()
  }
  checkIsFingerOnAir() {
    let l = Math.sqrt(Math.pow((this.x - this.player.x), 2) + Math.pow((this.y - this.player.y), 2))
    return l < Math.abs(this.width /2+ this.player.width/2);
  }
  update() {
    if (!this.visible)
      return 
    if (this.checkIsFingerOnAir()) {
      databus.bulletClass= this.bulletClass
      this.visible = false
      databus.pools.recover(this.name, this)
    }
  }
}

