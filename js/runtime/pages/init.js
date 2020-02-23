import DataBus from '../../main/databus'
let databus = new DataBus()
import {
  groundWidth,
  groundHeight,
  screenHeight,
  screenWidth,
  initPics
} from '../../utils/common'
let instance
let leftP = (screenWidth - 386) / 2

export default class Init {
  constructor() {
    if ( instance )
      return instance
      this.videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-dc5ba2a345c46dc9'
      }).onError((e)=>{
        console.log(e)
      })
      console.log(this.videoAd)
      this.videoAd&&this.videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    instance = this
    this.tempIamg = initPics()
    
    this.bg = this.tempIamg[0]
    this.button = this.tempIamg[1]
  }
  checkStart=(x, y)=> {
    return !!(x >= this.start.startX
      && y >= this.start.startY
      && x <= this.start.endX
      && y <= this.start.endY
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
      
      if(databus.isShowLearn){
        databus.pageIndex = 5
      }else{
        databus.pageIndex = 2
      }
    }
    if (instance.checkRunking(x, y)) {
      databus.pageIndex = 1
    }
    console.log( databus.pageIndex)
  }
  update(){
    
  }
  render(ctx) {
    let panelWidth = 300
    let iniY = (screenHeight -150)/ 2 +20
    let iniX = screenWidth / 2 - 200 + databus.transX
    
    // ctx.drawImage(this.bg, 0, 0, 1600, 750, databus.transX, databus.transY,screenWidth , screenHeight )
    ctx.save()
    ctx.translate(databus.transpX, databus.transpY)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(this.button, 0, 0, 858, 648, screenWidth / 2 - panelWidth/2 + databus.transX,iniY, panelWidth, panelWidth * (628 / 848))
    ctx.restore()
    this.start = {
      startX: screenWidth / 2 - 150 + databus.transX,
      startY: panelWidth * (628 / 848) * (37 / 65) + iniY,
      endX: iniX + panelWidth,
      endY: panelWidth * (628 / 848) * (37 / 65) + iniY + (panelWidth / 848 * 120)
    }
    this.runking={
      startX: screenWidth / 2 - 150 + databus.transX,
      startY: panelWidth * (628 / 848) * (514 / 650) + iniY,
      endX: iniX + panelWidth,
      endY: panelWidth * (628 / 848) * (630 / 650) + iniY
    }
  }
}