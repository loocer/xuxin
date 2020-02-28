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
let temp=databus.bulletClass
const fullt =function(){
 temp = rnd(0,3)
 if(temp==databus.bulletClass){
  fullt()
 }
 return temp
}
export default class Boom { 
  constructor(x, y) {
    if ( instance )
      return instance
    instance = this
    this.bulletIndex = 0
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
    
    this.bulletIndex = fullt()
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
      ctx.fillText(bullets[this.bulletIndex][0], this.height/3,-this.height/3);
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
      this.player.fireAcTime = 0
      databus.bulletClass= this.bulletIndex
      // if(this.bulletIndex==0){
      //   databus.audio.play(() => {
      //     console.log('开始播放')
      //   })
      // }else{
      //   databus.audio.pause(() => {
      //     console.log('开始播放')
      //   })
      // }
      this.visible = false
      databus.pools.recover(this.name, this)
    }
  }
}

