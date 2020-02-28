import DataBus from '../../main/databus'
import Player from '../../player/index'
import Boom from '../../gameTools/boom'
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
    this.over1 =  GAME_IMG.get('over')[0]
    this.over2 =  GAME_IMG.get('over')[1]
    this.bg = this.tempIamg[0]
    this.game = new Game()
    this.player = new Player()
    
    this.button = this.tempIamg[1]
  }
  checkStart=(x, y)=> {
    return !!(x >= this.start.startX
      && y >= this.start.startY
      && x <= this.start.endX
      && y <= this.start.endY
    )
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
    if (instance.checkStart(x, y)) {
      databus.isFinsh= false
      databus.videoAd.show().catch(() => {
        // 失败重试
        databus.videoAd.load()
          .then(() => databus.videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
      databus.videoAd.onClose((res)=>{
        if(res.isEnded){
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: '你是一个可爱的玩家，立刻复活吧！',
            success (res) {
              if (res.confirm) {
                databus.banner.hide()
                instance.player.goOnLive()
              }
            }
          })
          databus.videoAd.offClose()
        }else{
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: '广告未结束，复活无效！',
            success (res) {
              if (res.confirm) {
                
              }
            }
          })
          databus.videoAd.offClose()
        }
      })
    }
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
    let panelWidth = 400
    let iniY = (screenHeight -150)/ 2 +70
    let iniX = (screenWidth -400) / 2
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.game.render(ctx)
    
    ctx.save()
    ctx.translate(databus.transpX, databus.transpY)
    
    ctx.drawImage(this.over2,0, 0,screenWidth, screenHeight)
    ctx.fillText(
      '本次游戏得分:'+databus.score,
      iniX,
      (screenHeight -150)/ 2+50
    )
    ctx.drawImage(this.over1,iniX, iniY,400, 400* (150/537))
    ctx.restore()
    this.start = {
      startX: screenWidth / 2,
      startY: iniY,
      endX: screenWidth / 2+200,
      endY: iniY + 400* (150/537)/2,
    }
    this.runking={
      startX: iniX,
      startY:iniY + 400* (150/537)/2,
      endX: screenWidth / 2,
      endY: iniY + 400* (150/537)
    }
    this.restar={
      startX: screenWidth / 2,
      startY: iniY + 400* (150/537)/2,
      endX: screenWidth / 2+200,
      endY: iniY + 400* (150/537)
    }
    this.share={
      startX: iniX,
      startY: iniY,
      endX: screenWidth / 2,
      endY: iniY + 400* (150/537)/2,
    }
  }
}