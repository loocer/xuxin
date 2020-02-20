import DataBus from '../../main/databus'
import Player from '../../player/index'
let databus = new DataBus()
import {
  screenHeight,
  screenWidth,
  GAME_IMG,
  initPics
} from '../../utils/common'
import Game from './game'
let instance
let leftP = (screenWidth - 386) / 2
export default class Init {
  constructor() {
    if ( instance )
      return instance

    instance = this
    this.tempIamg = initPics()
    this.over1 =  GAME_IMG.get('over')[2]
    this.over2 =  GAME_IMG.get('over')[1]
    this.bg = this.tempIamg[0]
    this.game = new Game()
    this.player = new Player()
    
    this.button = this.tempIamg[1]
  }
  
  resStart=(x, y)=> {
    return !!(x >= this.restar.startX
      && y >= this.restar.startY
      && x <= this.restar.endX
      && y <= this.restar.endY
    )
  }
  checkShare=(x, y)=> {
    return !!(x >= this.share.startX
      && y >= this.share.startY
      && x <= this.share.endX
      && y <= this.share.endY
    )
  }
  checkRunking=(x, y)=> {
    return !!(x >= this.runking.startX
      && y >= this.runking.startY
      && x <= this.runking.endX
      && y <= this.runking.endY
    )
  }
  addEventLinner(){
    databus.touchHandler = this.touchHandler
    wx.onTouchStart(databus.touchHandler)
    // canvas.addEventListener('touchstart',databus.touchHandler)
  }
  touchHandler(e){
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if(instance.resStart(x,y)){
      wx.onTouchMove(databus.moveHandler)
      instance.player.resetLife()
      databus.reset()
    }
    if(instance.checkRunking(x,y)){
      wx.onTouchMove(databus.moveHandler)
      instance.player.resetLife()
      databus.reset()
      databus.pageIndex = 1
    }
    if(instance.checkShare(x,y)){
      wx.shareAppMessage({
        title: '子弹上膛，一梭子下去死一片，就是这么燃！',
        imageUrl: 'images/share.png',
      })
    }
    console.log( databus.pageIndex)
  }
  update(){
    databus.leftPositions.touched = false
    databus.rightPositions.touched = false
  }
  render(ctx) {
    let panelWidth = 200
    let panelHeight = 220 *(200/273)
    let iniY = (screenHeight -220 *(200/273))/ 2 
    let iniX = (screenWidth -panelWidth) / 2
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.game.render(ctx)
    ctx.save()
    ctx.translate(databus.transpX, databus.transpY)
    ctx.drawImage(this.over2,0, 0,screenWidth, screenHeight)
    ctx.drawImage(this.over1,iniX, iniY,panelWidth, 220 *(200/273))
    ctx.restore()
    this.runking={
      startX: iniX,
      startY: iniY +panelHeight/3*2,
      endX: iniX +panelWidth ,
      endY: iniY +panelHeight,
    }
    this.restar={
      startX: iniX,
      startY: iniY +panelHeight/3,
      endX: iniX +panelWidth ,
      endY: iniY +panelHeight/3*2,
    }
    this.share={
      startX: iniX,
      startY: iniY,
      endX: iniX +panelWidth ,
      endY: iniY +panelHeight/3,
    }
  }
}