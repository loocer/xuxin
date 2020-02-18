import Player from './player/index'
import CreateEnemyt from './npc/createEnemyt'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import HandShank from './runtime/handshank'
import Righthandshank from './runtime/righthandshank.js'
import ToolPanel from './runtime/toolPanel.js'
import {
  getRoteImg
} from './utils/index'
import Bullet from './bullet/bullet2'
import DataBus from './databus'
import Gamecreate from './gameTools/create'
import CreateIndex from './npc/createIndex.js'
const worker = wx.createWorker('workers/request/index.js')

import {
  groundWidth,
  groundHeight,
  screenWidth,
  screenHeight
} from './utils/common'


// let ctx = canvas.getContext('2d')
const wground = groundWidth
const hground = groundHeight

let sysInfo = wx.getSystemInfoSync(),
  width = sysInfo.windowWidth,
  height = sysInfo.windowHeight;

// canvas.style.width = width + "px";
// canvas.style.height = height + "px";
// canvas.height = height * window.devicePixelRatio;
// canvas.width = width * window.devicePixelRatio;
// ctx.scale(window.devicePixelRatio, window.devicePixelRatio);



let openDataContext = wx.getOpenDataContext()
let sharedCanvas = openDataContext.canvas
sharedCanvas.style.width = width + "px";
sharedCanvas.style.height = height + "px";
sharedCanvas.height = height * window.devicePixelRatio;
sharedCanvas.width = width * window.devicePixelRatio;

var databus, createIndex, createEnemy,ctx
let shareFlag = false
/**
 * 游戏主函数
 */

export default class Main {
  constructor(ctx) {
    this.ctx = ctx
    databus = new DataBus(ctx)
    createIndex = new CreateIndex(ctx)
    createEnemy = new CreateEnemyt(ctx)
    // 维护当前requestAnimationFrame的id
    this.aniId = 0
    this.init()
    // this.restart()
  }
  getMsg() {
    let that = this
    worker.onMessage(function(res) {
      let temp = res.msg
      databus.corpses = temp.corpses
      databus.enemys = temp.enemys
      databus.bullets = temp.bullets
      databus.gameTools = temp.gameTools
    })
  }
  init() {
    this.bindLoop = this.loop.bind(this)
    this.toolPanel = new ToolPanel()
    window.cancelAnimationFrame(this.aniId);
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
    this.gameinfo = new GameInfo(this)
    this.touchHandler = this.initTouchHandler.bind(this)
    canvas.addEventListener('touchstart', this.touchHandler)
    openDataContext.postMessage({
      data: databus,
      command: 'showRanking'
    })
  }
  initTouchRunkingStart(e) {
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let runkingStart = this.gameinfo.runkingStart
    if (x >= runkingStart.startX &&
      x <= runkingStart.endX &&
      y >= runkingStart.startY &&
      y <= runkingStart.endY) {
      canvas.removeEventListener(
        'touchstart',
        this.touchHandler
      )
      this.restart()
      return
    }
  }
  initTouchHandler(e) {


    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (this.gameinfo.checkIsFingerOnAir(x, y)) {
      this.restart()
    }
    if (this.gameinfo.checkIsFingerRunking1(x, y)) {
      canvas.removeEventListener(
        'touchstart',
        this.touchHandler
      )
      this.touchHandler = this.initTouchRunkingStart.bind(this)
      canvas.addEventListener('touchstart', this.touchHandler)
      databus.state = 3

    }
    // let area = this.gameinfo.btnArea

    // if (x >= area.startX &&
    //   x <= area.endX &&
    //   y >= area.startY &&
    //   y <= area.endY) {
    //   canvas.removeEventListener(
    //     'touchstart',
    //     this.initTouchHandler
    //   )
    //   this.restart()
    //   return
    // }
  }

  restart() {
    // wx.triggerGC()

    databus.reset(this.ctx)
    databus.state = 2
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )
    databus.bulletClass = {
      name: 'bullet2',
      class: Bullet
    }
    this.bg = new BackGround(this.ctx)

    this.righthandshank = new Righthandshank()
    this.handShank = new HandShank(this)
    this.player = new Player(this)
    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false
    this.gamecreate = new Gamecreate()
    canvas.addEventListener('touchstart', this.handShank.touchstartEvent)
    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
    openDataContext.postMessage({
      data: databus,
      command: 'showRanking'
    })
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.checkNum==1){
      createIndex.main(databus)
    }
   
    // if (databus.frame % 2e3 === 0) {

    //   createEnemy.createEnemy()
    //   // enemy.init(6)

    // }
    // if (databus.frame == 1e4) {
    //   databus.frame = 0
    // }
    // if (databus.frame == 2 * 1e3) {
    //   databus.createEnemysStatus = 3
    // }
    // if (databus.frame == 1e3) {
    //   databus.createEnemysStatus = 2
    // }
    // if (databus.frame == 0) {
    //   databus.createEnemysStatus = 1
    // }

  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      let temp = []
      for (let enemy of databus.enemys) {
        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          bullet.visible = false
          databus.pools.recover(bullet.name, bullet)
          if (--enemy.lifeValue == 0) {
            databus.score += enemy.score
            enemy.visible = false
            enemy.playOvers()
            databus.pools.recover('enemy', enemy)
          }
        }
      }
    })
    for (let itemob of databus.enemys) {
      let enemy = itemob
      databus.gameTools.forEach((item) => {
        if (item.checkIsFingerOnEnemy(enemy)) {
          databus.score += enemy.score
          enemy.visible = false
          enemy.playOvers()
          databus.pools.recover('enemy', enemy)
        }
      })

      if (this.player.isplesCollideWith(enemy)) {
        enemy.visible = false
        enemy.playOvers()
        databus.score += enemy.score
        databus.pools.recover('enemy', enemy)
          --databus.lifeValue
        if (databus.lifeValue == 0) {
          databus.gameOver = true
        }
        break
      }
    }

  }
  rowMove(ctx) {
    let tempX = this.player.x > databus.playTempX ? Math.abs(this.player.x - databus.playTempX) : -Math.abs(this.player.x - databus.playTempX)
    databus.playTempX = this.player.x
    this.handShank.x += tempX
    this.righthandshank.x += tempX
    databus.transX = this.handShank.x - 100
    ctx.translate(-tempX, 0)
  }
  colMove(ctx) {
    let tempY = this.player.y > databus.playTempY ? Math.abs(this.player.y - databus.playTempY) : -Math.abs(this.player.y - databus.playTempY)
    databus.playTempY = this.player.y
    this.handShank.y += tempY
    this.righthandshank.y += tempY
    databus.transY = this.handShank.y - (screenHeight - 160)
    ctx.translate(0, -tempY)
  }
  //视觉移动 不至于第一人称跑出屏幕
  cameraMove(ctx) {
    if (this.handShank.touched &&
      (this.player.x + databus.moveX) > 0 &&
      (this.player.x + databus.moveX) < wground
    ) {
      this.player.x += (databus.moveX)
    }
    if (this.handShank.touched &&
      (this.player.y + databus.moveY) > 0 &&
      (this.player.y + databus.moveY) < hground
    ) {
      this.player.y += (databus.moveY)
    }
    if (this.handShank.touched &&
      (this.player.x + databus.moveX) > screenWidth / 2 &&
      (this.player.x + databus.moveX) < wground - screenWidth / 2
    ) {
      // this.rowMove(ctx)

    }
    if (this.handShank.touched &&
      (this.player.y + databus.moveY) > screenHeight / 2 &&
      (this.player.y + databus.moveY) < hground - screenHeight / 2
    ) {
      // this.colMove(ctx)

    }
    // if (this.handShank.isInsite) {//点击在手柄内
    if (this.handShank.touched && databus.x) {
      this.handShank.tx = databus.x + databus.transX - 60
      this.handShank.ty = databus.y + databus.transY - 60
    }

    let pobj = {}
    pobj.x1 = databus.x + databus.transX //点击
    pobj.x2 = this.handShank.x + 60
    pobj.y1 = (databus.y + databus.transY)
    pobj.y2 = this.handShank.y + 60
    getRoteImg(pobj, this.handShank)
    let r = databus.playerSpeed / Math.sqrt((pobj.x1 - pobj.x2) * (pobj.x1 - pobj.x2) + (pobj.y1 - pobj.y2) * (pobj.y1 - pobj.y2))
    databus.moveX = (pobj.x1 - pobj.x2) * r
    databus.moveY = (pobj.y1 - pobj.y2) * r
  }
  touchRankingEventHandler(e) {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (this.toolPanel.checkIsFingerOnAir(x, y)) {
      databus.showUserStorageFlag = !databus.showUserStorageFlag
    }
  }
  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()
    let x = e.touches[0].clientX + databus.transX
    let y = e.touches[0].clientY + databus.transY
    let {
      share,
      restart,
      runking
    } = this.gameinfo
    if (x >= runking.startX &&
      x <= runking.endX &&
      y >= runking.startY &&
      y <= runking.endY) {
      canvas.removeEventListener(
        'touchstart',
        this.touchHandler
      )
      this.touchHandler = this.initTouchRunkingStart.bind(this)
      canvas.addEventListener('touchstart', this.touchHandler)
      databus.state = 3
    }

    if (x >= restart.startX &&
      x <= restart.endX &&
      y >= restart.startY &&
      y <= restart.endY) {
      this.restart()
      return
    }
    if (x >= share.startX &&
      x <= share.endX &&
      y >= share.startY &&
      y <= share.endY) {
      wx.shareAppMessage({
        title: '孤独的828战士，会不会成为第829战死的将士呢？',
        // imageUrl: canvas.toTempFilePathSync({
        //   destWidth: 500,
        //   destHeight: 400
        // })
        imageUrl: 'images/share.png',
        // imageUrlId:'EaPjTeGFSY-aOIUlhIIWOw'
      })
      if (shareFlag) {
        setTimeout(() => {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '已复活点击继续',
            success(res) {
              shareFlag = true
              databus.gameOver = false
              databus.stopFlag = false
              databus.lifeValue = 20
              // temp.restart()
            }
          })
        }, 2000)
      } else {
        
        setTimeout(() => {
          let temp = this
          wx.showModal({
            title: '转发失败',
            confirmText: '继续转发',
            success(res) {
              if (res.confirm) {
                wx.shareAppMessage({
                  title: '孤独的828战士，会不会成为第829战死的将士呢？',
                  imageUrl: 'images/share.png',
                })
                setTimeout(() => {
                  wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '已复活点击继续',
                    success(res) {
                      shareFlag = true
                      databus.gameOver = false
                      databus.stopFlag = false
                      databus.lifeValue = 20
                      // temp.restart()
                    }
                  })
                }, 2000)
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }, 2000)

      }
    }
    // let rankIng = this.gameinfo.rankIng
    // if (x >= rankIng.startX &&
    //   x <= rankIng.endX &&
    //   y >= rankIng.startY &&
    //   y <= rankIng.endY) {
    //   databus.showUserStorageFlag = false
    //   return
    // }

    // let share = this.gameinfo.btnShare
    // if (x >= share.startX &&
    //   x <= share.endX &&
    //   y >= share.startY &&
    //   y <= share.endY) {
    //   wx.shareAppMessage({
    //     title: '老子不服就是要干爆你',
    //     imageUrl: canvas.toTempFilePathSync({
    //       destWidth: 500,
    //       destHeight: 400
    //     })
    //     // imageUrl: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=606551735,1600986175&fm=26&gp=0.j'
    //   })

    // }

  }
  initRender() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.gameinfo.initRender(this.ctx)
  }
  runKingRender() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.gameinfo.runKingRender(this.ctx)
  }
  doingRender() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ctx.translate(0, -1)
    this.bg.render(this.ctx)

    Array.from(databus.corpses).forEach((item) => {
      if (item.visible) {
        item.render(this.ctx)
      }
    })
    Array.from(databus.bullets)
      .concat(Array.from(databus.enemys))
      .forEach((item) => {
        if (item.visible) {
          item.drawToCanvas(this.ctx)
        }
      })
    databus.gameTools.forEach((item) => {
      if (item.visible) {
        item.drawToCanvas(this.ctx)
      }
    })


    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(this.ctx)
      }
    })

    this.player.drawToCanvas(this.ctx)
    this.gameinfo.renderGameScore(this.ctx, databus.score)
    this.gameinfo.renderPlayerBleed(this.ctx, this.player)
    this.handShank.renderHandShank(this.ctx, this.player)
    this.righthandshank.renderHandShank(this.ctx)
    // this.ctx.drawImage(sharedCanvas, databus.transX, databus.transY, 1200, 800)
    // openDataContext.postMessage({
    //   data: databus,
    //   command: 'render'
    // })
    // 游戏结束停止帧循环
    // this.gameinfo.renderGameOver(this.ctx, databus.score)
    if (databus.gameOver) {
      this.addScore()
      this.gameinfo.renderGameOver(this.ctx, databus.score)
      databus.state == 4
      databus.stopFlag = true
      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        // canvas.removeEventListener('touchstart', this.handShank.touchstartEvent)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
    this.toolPanel.drawToCanvas(this.ctx)

  }
  addScore() {
    // ctx.drawImage(sharedCanvas, databus.panelPosition.rankingX + databus.transX, databus.transY, 500, 375)
    openDataContext.postMessage({
      data: databus,
      command: 'addScore'
    })
  }
  showRanking() {
    let panelWidth = 400
    let iniY = (screenHeight - panelWidth * (720 / 910)) / 2 + databus.transY
    let iniX = screenWidth / 2 - panelWidth / 2 + databus.transX
    this.toolPanel.updata()
    this.ctx.drawImage(sharedCanvas, iniX + 130 * (panelWidth / 910), iniY + 200 * (panelWidth / 910), (panelWidth / 910) * 680, (panelWidth / 910) * 360)

  }
  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    if (databus.state == 1) {
      this.initRender()
    }
    if (databus.state == 3) {
      this.runKingRender()
      this.showRanking()
    }
    if (databus.state == 2) {
      this.doingRender()
    }
  }
  initUpdata() {

  }
  // 游戏逻辑更新主函数
  update() {
    if (databus.state == 1) {
      this.initUpdata()
      return
    }
    if (databus.state == 3) {
      return
    }
    if (databus.showUserStorageFlag) {
      return
    }
    if (databus.gameOver)
      return;
      console.log(databus.transY)
    this.cameraMove(this.ctx)
    this.gamecreate.createEnemy1()
    this.bg.update()
    databus.corpses.forEach((item) => {
      item.update()
    })
    Array.from(databus.bullets)
      .concat(Array.from(databus.enemys))
      .forEach((item) => {
        item.update(this.player)
      })
    databus.gameTools.forEach((item) => {
      item.update(this.player)
    })
    this.enemyGenerate()

    this.collisionDetection()

    // if (databus.frame % databus.createSpeed === 0 && this.righthandshank.touched) {
    if (databus.frame % databus.createSpeed == 0 && this.righthandshank.touched) {
      this.player.shoot()
    }
    // this.player.rotate = this.righthandshank.rotate
    this.player.rotateBody = this.righthandshank.rotate
    this.player.rotateLag = this.handShank.rotate
    //--------------回收----------
    // console.log(222222222222222222, JSON.stringify(deepCopy(databus)))
    // worker.postMessage({
    //   msg: databus
    // })
    if (true) {
      for (let item of databus.corpses) {
        if (!item.visible) {
          databus.corpses.delete(item);
        }
      }
      for (let item of databus.enemys) {
        if (!item.visible) {
          databus.enemys.delete(item);
        }
      }
      // databus.enemys.forEach((item) => {
      //   if (item.visible) {
      //     temp.push(item)
      //   }
      // })
      // databus.enemys = temp
      for (let item of databus.bullets) {
        if (!item.visible) {
          databus.bullets.delete(item);
          // temp.push(item)
        }
      }
      let temp = []
      // Array.from(databus.bullets).forEach((item) => {
      //   if (item.visible) {
      //     temp.push(item)
      //   }
      // })
      // databus.bullets = temp
      databus.gameTools.forEach((item) => {
        if (item.visible) {
          temp.push(item)
        }
      })
      databus.gameTools = temp
      this.player.lifeValue = databus.lifeValue
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++
      wx.triggerGC()
    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}