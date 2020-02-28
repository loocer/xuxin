import DataBus from '../../main/databus'
import Player from '../../player/index'
import * as common from '../../utils/common'
import * as enemy from '../../npc/index'
import * as gameTools from '../../gameTools/index'
import * as hand from '../hand/index'
import {
  bleed1,
} from '../../utils/common'
import {
  biHuBody
} from '../../utils/common.js'
let databus = new DataBus()
let instance
let leftP = (databus.screenWidth) / 4
let tempBg = new Image()
tempBg.src = ''
export default class game {
  constructor() {
    if (instance)
      return instance

    instance = this
    this.tempIamg = common.initPics()
    this.bg = this.tempIamg[0]
    this.button = this.tempIamg[1]
    this.atlas = bleed1[0]
    this.bodyPicS = biHuBody
    this.player = new Player(this)

  }
  checkStart = (x, y) => {
    return !!(x >= this.start.startX &&
      y >= this.start.startY &&
      x <= this.start.endX &&
      y <= this.start.endY
    )
  }
  checkRunking = (x, y) => {
    return !!(x >= this.runking.startX &&
      y >= this.runking.startY &&
      x <= this.runking.endX &&
      y <= this.runking.endY
    )
  }
  addEventLinner(that) {
    hand.handEvent(that)
  }
  eventUpdate() {
    if (
      databus.leftPositions.touched && (databus.player.x + databus.moveX) > databus.screenWidth / 2 &&
      (databus.player.x + databus.moveX) < databus.groundWidth - databus.screenWidth / 2
    ) {
      databus.isTransX = true
    } else {
      databus.isTransX = false
    }
    if (
      databus.leftPositions.touched && (databus.player.y + databus.moveY) > databus.screenHeight / 2 &&
      (databus.player.y + databus.moveY) < databus.groundHeight - databus.screenHeight / 2
    ) {
      databus.isTransY = true
    } else {
      databus.isTransY = false
    }
    if (databus.isTransX) {
      let tempX = databus.player.x > databus.playTempX ? Math.abs(databus.player.x - databus.playTempX) : -Math.abs(databus.player.x - databus.playTempX)
      databus.transX = tempX
      databus.transpX += tempX
    } else {
      databus.transX = 0
    }
    if (databus.isTransY) {
      let tempY = databus.player.y > databus.playTempY ? Math.abs(databus.player.y - databus.playTempY) : -Math.abs(databus.player.y - databus.playTempY)
      databus.transY = tempY
      databus.transpY += tempY
    } else {
      databus.transY = 0
    }
  }
  shootUpdate() {
    if (databus.frame % databus.createSpeed === 0 && databus.rightPositions.touched) {
      this.player.fireAcTime = 0
      this.player.shoot()
    }
  }
  collisionDetection() {
    databus.bullets.forEach((bullet) => {
      for (let enemy of databus.enemys) {
        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          bullet.stopFlag = true
          if (bullet.name == 'bullet1') {
            enemy.lifeValue = 0
          } else {
            enemy.lifeValue--
          }
          if (enemy.lifeValue == 0) {
            databus.score += enemy.score
            enemy.visible = false
            enemy.playOvers()
            databus.pools.recover(enemy.name, enemy)
          }
        }
      }
    })
    for (let itemob of databus.enemys) {
      let enemy = itemob
      databus.gameTools.forEach((item) => {
        if (item.name == 'boom' &&
          enemy.visible &&
          item.checkIsFingerOnEnemy(enemy) &&
          item.visible
        ) {
          databus.score += enemy.score
          enemy.visible = false
          enemy.playOvers()
          databus.pools.recover(enemy.name, enemy)
        }
      })

      if (this.player.isplesCollideWith(enemy)) {
        enemy.visible = false
        enemy.playOvers()
        databus.score += enemy.score
        databus.pools.recover('enemy1', enemy)
          this.player.lifeValue-=enemy.score
        if (this.player.lifeValue < 0) {
          this.player.lifeValue = 0
          databus.gameOver = true
        }
        break
      }
    }


  }
  gameOver() {
    wx.offTouchMove(databus.moveHandler)
    databus.openDataContext.postMessage({
      data: databus,
      command: 'addScore'
    })
    if (databus.isShowLearn && databus.score > 200) {
      try {
        wx.setStorageSync('isShowLearn', false)
      } catch (e) {}
    }
    databus.isTransX = false
    databus.isTransY = false
    databus.transX = 0
    databus.transY = 0
    databus.moveX = 0
    databus.moveY = 0
    if (databus.time == 2) {
      // wx.onTouchMove(databus.moveHandler)
      // this.player.resetLife()
      // databus.reset()
      databus.pageIndex = 3
    } else {
      databus.pageIndex = 3
    }

  }
  update(ctx) {
    console.log(434)
    if (databus.gameOver) {
      this.gameOver()
      return
    }
    databus.frame++
    gameTools.create1()
    if (this.player.x + databus.moveX > 50 && this.player.x + databus.moveX < databus.groundWidth-50) {
      this.player.x += databus.moveX
    }
    if (this.player.y + databus.moveY > 50 && this.player.y + databus.moveY < databus.groundHeight-50) {
      this.player.y += databus.moveY
    }

    this.player.rotateBody = databus.leftPositions.rotate
    this.player.rotateLag = databus.rightPositions.rotate
    this.eventUpdate()
    databus.playTempX = this.player.x
    databus.playTempY = this.player.y
    this.shootUpdate()
    if (!databus.rightPositions.touched) {
      this.player.fireAcTime = 0
    }
    if (databus.frame % 100 == 0) {
      Array.from(databus.bleedBgs)
        .forEach((item) => {
          if (item.time == 0) {
            databus.bleedBgs.shift()
          } else {
            item.time--
          }
        })
    }
    if (databus.deedBady.length > 100) {
      databus.deedBady.shift()
    }
    if (databus.deedBady.length > 500) {
      databus.deedBady = databus.deedBady.slice(databus.deedBady.length - 200, databus.deedBady.length)
    }
    Array.from(databus.bullets)
      .forEach((item) => {
        if (item.visible) {
          item.update(ctx)
        }
      })
    Array.from(databus.gameTools)
      .forEach((item) => {
        if (item.visible) {
          item.update(ctx)
        }
      })
    // databus.addEnemyFlag = true
    Array.from(databus.mosterHouse)
      .forEach((item) => {
        if (item.visible) {
          // databus.addEnemyFlag = false
          item.update(ctx)
        }
      })
    if (databus.frame % 200 == 0) {
      databus.addEnemyFlag = true
    }
    let flagShow = false
    Array.from(databus.enemys)
      .forEach((item) => {
        if (item.visible) {
          databus.addEnemyFlag = false
          flagShow = true
          item.update(this.player)
        }
      })
    if (!flagShow) {
      // if(databus.checkIndex>1){
      //   databus.groundWidth = 1000
      //   databus.groundHeight = 800
      // }else{
      //   databus.groundWidth = databus.screenWidth
      //   databus.groundHeight = databus.screenHeight
      // }
      // if(databus.checkIndex == 2){
      //   wx.showToast({
      //     title: '你是高手，直接来到第3关！',
      //     icon: 'none',
      //     duration: 1000
      //   })
        
      // }else{
        wx.showToast({
          title: '敌军即将登场，准备战斗！',
          icon: 'none',
          duration: 1000
        })
      // }
      
    }

    enemy.create1()
    Array.from(databus.corpses)
      .forEach((item) => {
        if (item.visible) {
          item.update(ctx)
        }
      })
    this.collisionDetection()
  }
  renderBg(ctx) {
    ctx.drawImage(
      common.groundBg,
      0,
      0,
      databus.groundWidth,
      databus.groundHeight,
      0,
      0,
      databus.groundWidth,
      databus.groundHeight
    )
  }
  renderGameScore(ctx) {
    let trny = 0
    let trx = 0

    let leftP = (databus.screenWidth - 134) / 2
    ctx.fillStyle = "#fff"
    ctx.font = "20px Arial"
    ctx.drawImage(common.scoreBg, leftP- 70 ,0)
    ctx.drawImage(common.scoreBg, leftP+70 ,0)
    ctx.fillText(
      '分数:'+databus.score,
      leftP- 60,
      25 - trny
    )
    ctx.fillText(
      '第'+databus.checkIndex+'关',
      leftP+110,
      25 - trny
    )
  }
  renderPlayerBleed(ctx) {
    // let panelWidth = databus.screenWidth*.3
    // let trny = 0
    // let trx = 0
    // this.player.lifeValue = this.player.lifeValue > this.player.allLifeValue ? this.player.allLifeValue : this.player.lifeValue
    // // let length = -databus(screenWidth - 300) / 2
    // /*---------------------背景框-------------------------*/
    // // ctx.drawImage(common.scoreBg,0,0,420,36, leftP, 0,leftP+panelWidth,30)
    // ctx.drawImage(common.bloodBg,0,0,420,36, leftP, 0,panelWidth,30)
    // /*---------------------外框-------------------------》*/

    // ctx.lineWidth = 1;
    // ctx.strokeStyle = "#82E4F2";
    // ctx.beginPath();
    // ctx.arc(leftP - trx, -trny + 20, 8, Math.PI / 2, Math.PI / 2 * 3, false);

    // ctx.moveTo(leftP - trx, -trny + 12);
    // ctx.lineTo(databus.screenWidth - leftP - trx, -trny + 12);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(leftP - trx, -trny + 28);
    // ctx.lineTo(databus.screenWidth - leftP - trx, -trny + 28);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.arc(databus.screenWidth - leftP - trx, -trny + 20, 8, Math.PI / 2 * 3, Math.PI / 2, false);
    // ctx.stroke();

    // /*---------------------外框-------------------------《*/
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = "#82E4F2";
    // ctx.beginPath();
    // ctx.arc(leftP - trx, -trny + 20, 6, Math.PI / 2, Math.PI / 2 * 3, false);
    // ctx.fill();
    // ctx.beginPath();
    // let length = databus.screenWidth - leftP - trx - leftP - trx
    // ctx.fillRect(leftP - trx, -trny + 14, length * (this.player.lifeValue / this.player.allLifeValue), 12);
    // ctx.strokeStyle = "#82E4F2";
    // // ctx.lineJoin = "round";
    // ctx.stroke();

  }
  renderLeftHandShank(ctx) {
    let x = 40
    let y = databus.screenHeight - common.HAND_WIDTH - 40
    ctx.drawImage(
      common.GAME_IMG.get('hand'),
      0, 0, 248, 248,
      x,
      y,
      common.HAND_WIDTH, common.HAND_HEIGHT
    )
  }
  renderRightHandShank(ctx) {
    let x = databus.screenWidth - common.HAND_WIDTH - 40
    let y = databus.screenHeight - common.HAND_HEIGHT - 40
    ctx.drawImage(
      common.GAME_IMG.get('hand'),
      0, 0, 248, 248,
      x,
      y,
      common.HAND_WIDTH, common.HAND_HEIGHT
    )
  }
  render(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.translate(-databus.transX, -databus.transY)
    ctx.translate(databus.etranspX, databus.etranspY)
    this.renderBg(ctx)
    Array.from(databus.bleedBgs)
      .forEach((item) => {
        for (let i = 0; i < item.time; i++) {
          ctx.save()
          ctx.translate(item.tempList[0], item.tempList[1])
          ctx.rotate(item.tempList[2] * Math.PI / 180)
          ctx.drawImage(
            this.atlas,
            0, 0, 100, 100,
            -15,
            -15,
            30, 30
          )
          ctx.restore()
        }
      })
    Array.from(databus.deedBady)
      .forEach((item) => {
        ctx.save()
        ctx.translate(item[0], item[1])
        ctx.rotate(item[2] * Math.PI / 180)
        ctx.drawImage(
          this.bodyPicS,
          item[4],
          item[5],
          item[6],
          item[7],
          item[8],
          item[9],
          item[10],
          item[10],
        )
        ctx.restore()
      })
    Array.from(databus.corpses)
      .forEach((item) => {
        if (item.visible) {
          item.drawToCanvas(ctx)
        }
      })

    Array.from(databus.enemys)
      .forEach((item) => {
        if (item.visible) {
          item.drawToCanvas(ctx)
        }
      })

    Array.from(databus.gameTools)
      .forEach((item) => {
        if (item.visible) {
          item.drawToCanvas(ctx)
        }
      })
    Array.from(databus.bullets)
      .forEach((item) => {
        if (item.visible) {
          item.drawToCanvas(ctx)
        }
      })
    this.player.drawToCanvas(ctx)
    Array.from(databus.mosterHouse)
      .forEach((item) => {
        if (item.visible) {
          item.drawToCanvas(ctx)
        }
      })
    ctx.save()
    ctx.translate(databus.transpX, databus.transpY)
    this.renderGameScore(ctx)
    this.renderLeftHandShank(ctx)
    this.renderRightHandShank(ctx)
    this.renderPlayerBleed(ctx)
    ctx.restore()
  }
}