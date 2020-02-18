import DataBus from '../../main/databus'
let databus = new DataBus()
import {
  groundWidth,
  groundHeight,
  screenHeight,
  screenWidth,
  initPics
} from '../../utils/common'

let leftP = (screenWidth - 386) / 2
const sysInfo = wx.getSystemInfoSync(),
  width = sysInfo.windowWidth,
  height = sysInfo.windowHeight;

let instance
export default class Runking {
  constructor() {
    if ( instance )
      return instance
      databus.openDataContext.postMessage({
        data: databus,
        command: 'showRanking'
      })
    instance = this
    this.tempIamg = initPics()
    this.bg = this.tempIamg[0]
    this.button = this.tempIamg[1]
    this.button2 = this.tempIamg[2]
    this.button3 = this.tempIamg[3]
    this.runkingStart= {}
  }
  checkRunking=(x, y)=> {
    return !!(x >= this.runkingStart.startX
      && y >= this.runkingStart.startY
      && x <= this.runkingStart.endX
      && y <= this.runkingStart.endY
    )
  }
  addEventLinner(){
    databus.touchHandler = this.touchHandler
    wx.onTouchStart(databus.touchHandler)
    // canvas.addEventListener('touchstart',databus.touchHandler)
  }
  touchHandler(e,that){
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (instance.checkRunking(x, y)) {
      databus.pageIndex = 2
    }
  }
  update(){
    
  }
  showRanking(ctx) {
    let panelWidth = 400
    let iniY = (screenHeight - panelWidth * (720 / 910)) / 2 
    let iniX = screenWidth / 2 - panelWidth / 2 
    ctx.drawImage(sharedCanvas, iniX + 130 * (panelWidth / 910), iniY + 200 * (panelWidth / 910), (panelWidth / 910) * 680, (panelWidth / 910) * 360)

  }
  render(ctx) {
    let panelWidth =400
    let iniY = (screenHeight - panelWidth * (720 / 910)) / 2 
    let iniX = screenWidth / 2 - panelWidth/2 
    
    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.translate(databus.transpX, databus.transpY)
    ctx.drawImage(this.bg, 0, 0, 910, 720, 0, 0, screenWidth, screenHeight)
    ctx.drawImage(this.button3, 0, 0, 910, 720, iniX, iniY, panelWidth, panelWidth * (720 / 910))
    
    this.showRanking(ctx)
    ctx.restore()
    this.runkingStart = {
      startX: iniX + 310 * panelWidth / 910 + databus.transX,
      startY: iniY + 600 * panelWidth / 910 + databus.transY,
      endX: iniX + 650 * panelWidth / 910 + databus.transX,
      endY: iniY + 710 * panelWidth / 910 + databus.transY,
    }
  }
}