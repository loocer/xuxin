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
let leftP = (common.screenWidth - 386) / 2
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
      databus.leftPositions.touched && (databus.player.x + databus.moveX) > common.screenWidth / 2 &&
      (databus.player.x + databus.moveX) < common.groundWidth - common.screenWidth / 2
    ) {
      databus.isTransX = true
    } else {
      databus.isTransX = false
    }
    if (
      databus.leftPositions.touched && (databus.player.y + databus.moveY) > common.screenHeight / 2 &&
      (databus.player.y + databus.moveY) < common.groundHeight - common.screenHeight / 2
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
      // if (databus.frame % databus.createSpeed == 0 && this.righthandshank.touched) {
      this.player.shoot()
    }
  }
  collisionDetection() {
    let that = this
    databus.bullets.forEach((bullet) => {
      let temp = []
      for (let enemy of databus.enemys) {
        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          bullet.stopFlag = true
          if (--enemy.lifeValue == 0) {
            databus.score += enemy.score
            enemy.visible = false
            enemy.playOvers()
            databus.pools.recover('enemy1', enemy)
          }
        }
      }
    })
    for (let itemob of databus.enemys) {
      let enemy = itemob
      if (this.player.isplesCollideWith(enemy)) {
        enemy.visible = false
        enemy.playOvers()
        databus.score += enemy.score
        databus.pools.recover('enemy1', enemy)
          --this.player.lifeValue
        if (this.player.lifeValue == 0) {
          databus.gameOver = true
        }
        break
      }
    }

  }
  update(ctx) {
    if (databus.gameOver) {
      wx.offTouchMove(databus.moveHandler)
      databus.openDataContext.postMessage({
        data: databus,
        command: 'addScore'
      })
      databus.isTransX = false
      databus.isTransY = false
      databus.transX = 0
      databus.transY = 0
      databus.moveX = 0
      databus.moveY = 0
      if(databus.time==2){
        databus.pageIndex = 4
      }else{
        databus.pageIndex = 3
      }
      return
    }
    databus.frame++
    enemy.create1()
    gameTools.create1()
    this.player.x += databus.moveX
    this.player.y += databus.moveY
    this.player.rotateBody = databus.leftPositions.rotate
    this.player.rotateLag = databus.rightPositions.rotate
    this.eventUpdate()
    databus.playTempX = this.player.x
    databus.playTempY = this.player.y
    this.shootUpdate()
    if (databus.bleedBgs.length > 100) {
      databus.bleedBgs.shift()
    }
    if (databus.deedBady.length > 100) {
      databus.deedBady.shift()
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
    Array.from(databus.mosterHouse)
      .forEach((item) => {
        if (item.visible) {
          item.update(ctx)
        }
      })
    Array.from(databus.enemys)
      .forEach((item) => {
        if (item.visible) {
          item.update(this.player)
        }
      })
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
      common.groundWidth,
      common.groundHeight,
      0,
      0,
      common.groundWidth,
      common.groundHeight
    )
  }
  renderGameScore(ctx) {
    let trny = 0
    let trx = 0
    let leftP = (common.screenWidth - 386) / 2
    ctx.fillStyle = "#82E4F2"
    ctx.font = "20px Arial"
    ctx.drawImage(common.scoreBg, leftP - trx - 162, -trny)
    ctx.fillText(
      databus.score,
      leftP - trx - 150,
      25 - trny
    )
  }
  renderPlayerBleed(ctx) {
    let trny = 0
    let trx = 0
    this.player.lifeValue = this.player.lifeValue > this.player.allLifeValue ? this.player.allLifeValue : this.player.lifeValue
    // let length = -trx + (screenWidth - 300) / 2
    /*---------------------背景框-------------------------*/
    ctx.drawImage(common.scoreBg, leftP - trx - 162, -trny)
    ctx.drawImage(common.bloodBg, leftP - trx - 18, -trny)
    /*---------------------外框-------------------------》*/

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#82E4F2";
    ctx.beginPath();
    ctx.arc(leftP - trx, -trny + 20, 8, Math.PI / 2, Math.PI / 2 * 3, false);

    ctx.moveTo(leftP - trx, -trny + 12);
    ctx.lineTo(common.screenWidth - leftP - trx, -trny + 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(leftP - trx, -trny + 28);
    ctx.lineTo(common.screenWidth - leftP - trx, -trny + 28);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(common.screenWidth - leftP - trx, -trny + 20, 8, Math.PI / 2 * 3, Math.PI / 2, false);
    ctx.stroke();

    /*---------------------外框-------------------------《*/
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#82E4F2";
    ctx.beginPath();
    ctx.arc(leftP - trx, -trny + 20, 6, Math.PI / 2, Math.PI / 2 * 3, false);
    ctx.fill();
    ctx.beginPath();

    ctx.fillRect(leftP - trx, -trny + 14, 300 * (this.player.lifeValue / this.player.allLifeValue), 12);
    ctx.strokeStyle = "#82E4F2";
    // ctx.lineJoin = "round";
    ctx.stroke();

  }
  renderLeftHandShank(ctx) {
    let x = 100
    let y = common.screenHeight - common.HAND_WIDTH - 40
    ctx.drawImage(
      common.GAME_IMG.get('hand'),
      0, 0, 248, 248,
      x,
      y,
      common.HAND_WIDTH, common.HAND_HEIGHT
    )
  }
  renderRightHandShank(ctx) {
    let x = common.screenWidth - common.HAND_WIDTH - 40
    let y = common.screenHeight - common.HAND_HEIGHT - 40
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
    this.renderBg(ctx)
    Array.from(databus.bleedBgs)
      .forEach((item) => {
        ctx.save()
        ctx.translate(item[0], item[1])
        ctx.rotate(item[2] * Math.PI / 180)
        ctx.drawImage(
          this.atlas,
          0, 0, 100, 100,
          -15,
          -15,
          30, 30
        )
        ctx.restore()
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
    // Array.from(databus.bleedBgs)
    // .forEach((item) => {
    //   ctx.save()
    //   ctx.translate(item[0], item[1])
    //   ctx.rotate(item[2] * Math.PI / 180)
    //   ctx.drawImage(
    //     this.atlas,
    //     0, 0, 100, 100,
    //     -15,
    //     -15,
    //     30, 30
    //   )
    //   ctx.restore()
    // })  
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
    Array.from(databus.mosterHouse)
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
    ctx.save()
    ctx.translate(databus.transpX, databus.transpY)
    this.renderGameScore(ctx)
    this.renderLeftHandShank(ctx)
    this.renderRightHandShank(ctx)
    this.renderPlayerBleed(ctx)
    ctx.restore()
  }
}