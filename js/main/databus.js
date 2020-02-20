
import Pools from '../base/pools'
let instance
const screenWidth = window.innerWidth 
const screenHeight = window.innerHeight 
/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if ( instance )
      return instance
    instance = this
    this.playTempX = screenWidth / 2
    this.playTempY = screenHeight / 2
    this.leftPositions = {
    }
    this.rightPositions = {
      touched: false,
      touchedx: 0,
      touchedy: 0
    }
    this.transpX = 0//canvas累计平移距离
    this.transpY = 0
    this.ctx = null
    this.pageList = []
    this.allImages = []
    this.pools = new Pools()
  }

  reset() {
    this.time = 1
    this.pools && this.pools.pool.clear();
    this.moveX = 0//手柄操作位移
    this.moveY = 0
    this.playTempX = screenWidth / 2
    this.playTempY = screenHeight / 2

    this.x = 0//鼠标位置
    this.y = 0
    this.shootX = 0//子弹打出去的初位置，为了确定方向
    this.shootY = 0
    
    this.frame      = 0
    this.score      = 0
    this.shootSpeed = 20
    this.createSpeed = 20
    this.playerSpeed = 2
    this.bulletClass = ['A','bullet1']
    
    this.bullets = new Set()
    this.enemys = new Set()
    this.mosterHouse = new Set()
    this.gameTools = new Set()
    this.bleedBgs = []
    this.deedBady = []
    this.touchHandler = null
    this.pageIndex = 0//1,刚进入游戏；2,结束游戏 3,再次开启游戏
    this.panelPosition = {
      rankingX:-400
    }
    this.lifeValue = 3000
    this.corpses = new Set()
    this.animations = []
    this.gameOver   = false
    this.isTransX = false 
    this.isTransY = false 
    this.transX = 0//每帧屏幕滚动距离
    this.transY = 0//每帧屏幕滚动距离
    
  }
  rester(){

  }
}
