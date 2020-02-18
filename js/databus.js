import Pool from './base/pool'
import Pools from './base/pools'

let instance
const screenWidth = window.innerWidth 
const screenHeight = window.innerHeight 
/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    this.testImag = ""
    this.transX = 0
    this.transY = 0

    this.shootX = 0
    this.shootY = 0

    this.x = 0
    this.y = 0
    this.createSpeed = 2
    this.bulletClass = {

    }
    this.playTempX = screenWidth/2
    this.playTempY = screenHeight/2

    this.screenWidth = 1200
    this.screenHeight = 800

    this.moveX = 0//手柄操作位移
    this.moveY = 0
    this.gameIndex = 0
    this.lifeValue = 200
    this.allImages =[]
    this.createEnemysStatus = 1//关卡
    if ( instance )
      return instance

    instance = this
    this.pools = new Pools()
    
    this.reset(null)
  }

  reset(ctx) {
    
    this.pools && this.pools.pool.clear();
   
    this.moveX = 0//手柄操作位移
    this.moveY = 0

    this.x = 0//鼠标位置
    this.y = 0
    this.showUserStorageFlag = false
    this.stopFlag = false
    this.shootX = 0
    this.shootY = 0
    this.playTempX = screenWidth / 2
    this.playTempY = screenHeight / 2
    this.frame      = 0
    this.score      = 0
    this.shootSpeed = 5
    this.playerSpeed = 2
    this.bulletClass = null
    this.bullets = new Set()
    this.enemys = new Set()
    this.gameTools = []
    this.state = 1//1,刚进入游戏；2,结束游戏 3,再次开启游戏
    this.panelPosition = {
      rankingX:-400
    }
    this.createSpeed = 10
    this.lifeValue = 10
    this.checkNum = 1
    this.corpses = new Set()
    this.animations = []
    this.gameOver   = false
    ctx&&ctx.translate(this.transX, this.transY)
    this.transX = 0//canvas平移距离
    this.transY = 0
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    let temp = this.enemys.shift()

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }
  removeEnemeyPlus(enemy) {

    enemy.visible = false

    this.pools.recover('enemy', enemy)
  }
  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    let temp = this.bullets.shift()

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }
}
