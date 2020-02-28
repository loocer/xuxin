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
    if (instance)
      return instance

    instance = this
    this.tempIamg = initPics()
    this.over1 = GAME_IMG.get('over')[2]
    this.over2 = GAME_IMG.get('over')[1]
    this.bg = this.tempIamg[0]
    this.game = new Game()
    this.player = new Player()

    this.button = this.tempIamg[1]
  }

  resStart = (x, y) => {
    return !!(x >= this.restar.startX &&
      y >= this.restar.startY &&
      x <= this.restar.endX &&
      y <= this.restar.endY
    )
  }
  checkShare = (x, y) => {
    return !!(x >= this.share.startX &&
      y >= this.share.startY &&
      x <= this.share.endX &&
      y <= this.share.endY
    )
  }
  checkRunking = (x, y) => {
    return !!(x >= this.runking.startX &&
      y >= this.runking.startY &&
      x <= this.runking.endX &&
      y <= this.runking.endY
    )
  }
  addEventLinner() {
    databus.touchHandler = this.touchHandler
    wx.onTouchStart(databus.touchHandler)
    // canvas.addEventListener('touchstart',databus.touchHandler)
  }
  touchHandler(e) {
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (instance.resStart(x, y)) {
      wx.onTouchMove(databus.moveHandler)
      instance.player.resetLife()
      databus.reset()
    }
    if (instance.checkRunking(x, y)) {
      wx.onTouchMove(databus.moveHandler)
      instance.player.resetLife()
      databus.reset()
      databus.pageIndex = 1
    }
    if (instance.checkShare(x, y)) {
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
  }
  update() {
    databus.leftPositions.touched = false
    databus.rightPositions.touched = false
  }
  render(ctx) {
    let panelWidth = 400
    let panelHeight = panelWidth * (347 / 747)
    let iniY = (screenHeight - panelHeight) / 2 + 70
    let iniX = (screenWidth - panelWidth) / 2


    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.game.render(ctx)
    ctx.save()
    ctx.translate(databus.transpX, databus.transpY)
    ctx.drawImage(this.over2, 0, 0, screenWidth, screenHeight)
    ctx.drawImage(this.over1, iniX, iniY, panelWidth, panelHeight)
    ctx.restore()
    this.runking = {
      startX: iniX,
      startY: iniY + panelHeight* (250/ 350),
      endX: iniX + panelWidth/2,
      endY: iniY + panelHeight,
    }
    this.restar = {
      startX: iniX +panelWidth/2,
      startY: iniY + panelHeight* (250/ 350),
      endX: iniX + panelWidth,
      endY: iniY + panelHeight,
    }
    this.share = {
      startX: iniX + panelWidth*(200/735),
      startY: iniY,
      endX: iniX + panelWidth*(550/735),
      endY: iniY + panelHeight* (250/ 350),
    }
  }
}