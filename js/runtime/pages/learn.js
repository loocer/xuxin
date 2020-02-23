import DataBus from '../../main/databus'
let databus = new DataBus()
import {
  screenHeight,
  screenWidth,
  initPics,
  GAME_IMG,
} from '../../utils/common'
let instance

export default class Learn {
  constructor() {
    if (instance)
      return instance

    instance = this
    this.tempIamg = initPics()
    this.stup = 1
    this.bg = GAME_IMG.get('learnBg')
    this.button = this.tempIamg[1]
  }
  checkStart = (x, y) => {
    return !!(x >= this.start.startX &&
      y >= this.start.startY &&
      x <= this.start.endX &&
      y <= this.start.endY
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
    if (instance.checkStart(x, y)) {
      if (instance.stup == 1) {
        instance.stup = 2
      }else if (instance.stup == 2) {
        instance.stup = 3
      } else if (instance.stup == 3) {
        databus.pageIndex = 2
        instance.stup = 1
      }
    }
  
    console.log(databus.pageIndex)
  }
  update() {

  }
  render(ctx) {
    if (this.stup == 1) {
      let iniY = 414 / 513 * screenHeight
      let iniX = 447 / 1111 * screenWidth
      ctx.save()
      ctx.translate(databus.transpX, databus.transpY)
      ctx.drawImage(this.bg[0], 0, 0, 1600, 750, databus.transX, databus.transY, screenWidth, screenHeight)
      // ctx.clearRect(0, 0, canvas.width, canvas.height)
      // ctx.drawImage(this.button, 0, 0, 858, 648, screenWidth / 2 - panelWidth/2 + databus.transX,iniY, panelWidth, panelWidth * (628 / 848))
      ctx.restore()
      this.start = {
        startX: iniX,
        startY: iniY,
        endX: iniX + 150,
        endY: iniY + 60
      }
    }
    if(this.stup==2){
      let iniY = 414 / 513 * screenHeight
      let iniX = 725 / 1111 * screenWidth
      ctx.save()
      ctx.translate(databus.transpX, databus.transpY)
      ctx.drawImage(this.bg[1], 0, 0, 1600, 750, databus.transX, databus.transY, screenWidth, screenHeight)
      // ctx.clearRect(0, 0, canvas.width, canvas.height)
      // ctx.drawImage(this.button, 0, 0, 858, 648, screenWidth / 2 - panelWidth/2 + databus.transX,iniY, panelWidth, panelWidth * (628 / 848))
      ctx.restore()
      this.start = {
        startX: iniX,
        startY: iniY,
        endX: iniX + 150,
        endY: iniY + 60
      }
    }
    if(this.stup==3){
      let iniY = 215 / 513 * screenHeight
      let iniX = 545 / 1111 * screenWidth
      ctx.save()
      ctx.translate(databus.transpX, databus.transpY)
      ctx.drawImage(this.bg[2], 0, 0, 1600, 750, databus.transX, databus.transY, screenWidth, screenHeight)
      ctx.restore()
      this.start = {
        startX: iniX,
        startY: iniY,
        endX: iniX + 150,
        endY: iniY + 60
      }
    }

  }
}