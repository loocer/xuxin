import * as page from '../runtime/pages/index'
import DataBus from './databus'
import Player from '../player/index'
import * as common from '../utils/common'
let sysInfo = wx.getSystemInfoSync(),
  width = sysInfo.windowWidth,
  height = sysInfo.windowHeight;
  const openDataContext = wx.getOpenDataContext()
  const sharedCanvas = openDataContext.canvas
  sharedCanvas.style.width = width + "px";
  sharedCanvas.style.height = height + "px";
  sharedCanvas.height = height * window.devicePixelRatio;
  sharedCanvas.width = width * window.devicePixelRatio;
 
var createIndex, createEnemy, ctx
let instance
export default class Main {
  constructor(ctx) {
    if ( instance )
      return instance
    instance = this
    this.ctx = ctx

    this.databus = new DataBus()
    this.databus.openDataContext = openDataContext
    this.databus.ctx = ctx
    this.aniId = 0
    this.init()
  }
  init() {
    this.player = new Player(this)
    this.databus.player = this.player
    this.bindLoop = this.loop.bind(this)
    window.cancelAnimationFrame(this.aniId);
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
    this.restart()
    this.touchHandler = page.work().touchHandler.bind(this)
    canvas.addEventListener('touchstart', this.touchHandler)

  }
  restart() {
    // wx.triggerGC()

    this.databus.leftPositions = common.leftPositions
    this.databus.rightPositions = common.rightPositions
    this.databus.reset()
  }
  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    let {
      ctx,
      databus
    } = this
    page.work(this).render(ctx)
  }
  shootUpdate(){
    if (this.databus.frame % this.databus.createSpeed === 0&&this.databus.rightPositions.touched) {
      // if (databus.frame % databus.createSpeed == 0 && this.righthandshank.touched) {
        this.player.shoot()
      }
  }
  // 游戏逻辑更新主函数
  update() {
    let {
      ctx,
      databus
    } = this
    page.work(this).update(ctx)
    
  }
  // 实现游戏帧循环
  loop() {
    this.update()
    this.render()
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

}