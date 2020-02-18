import DataBus from '../../main/databus'
import * as common from '../../utils/common'
import * as tools from '../../utils/tools'
// import Player from '../../player/index'
const databus = new DataBus()
// let player = new Player()
let that = null
const leftHandCheck = (x, y) => {
  let lx = 100
  let ly = common.screenHeight - common.HAND_WIDTH - 40
  let thisx = databus.leftPositions.x
  let thisy = databus.leftPositions.y
  const deviation = 0
  return !!(x >= thisx - deviation &&
    y >= thisy - deviation &&
    x <= thisx + common.HAND_WIDTH + deviation &&
    y <= thisy + common.HAND_HEIGHT + deviation)
}
const rightHandCheck = (x, y) => {
  let rx = common.screenWidth - common.HAND_WIDTH - 40
  let ry = common.screenHeight - common.HAND_HEIGHT - 40
  let thisx = rx
  let thisy = ry
  const deviation = 0
  return !!(x >= thisx - deviation &&
    y >= thisy - deviation &&
    x <= thisx + common.HAND_WIDTH + deviation &&
    y <= thisy + common.HAND_HEIGHT + deviation)
}

const leftFormatMovePosition = (x, y) => {
  let pobj = {}
  pobj.x1 = x //点击
  pobj.x2 = 100 + 60
  pobj.y1 = y
  pobj.y2 = common.screenHeight - common.HAND_WIDTH + 20
  tools.getRoteImg(pobj, databus.leftPositions)
  let r = databus.playerSpeed / Math.sqrt((pobj.x1 - pobj.x2) * (pobj.x1 - pobj.x2) + (pobj.y1 - pobj.y2) * (pobj.y1 - pobj.y2))
  databus.moveX = (pobj.x1 - pobj.x2) * r
  databus.moveY = (pobj.y1 - pobj.y2) * r

}
const getStoot = (x, y) => {
  let pobj = {}
  pobj.x2 = 0
  pobj.x1 = x
  pobj.y2 = 0
  pobj.y1 = y
  let r = databus.playerSpeed / Math.sqrt((pobj.x1 - pobj.x2) * (pobj.x1 - pobj.x2) + (pobj.y1 - pobj.y2) * (pobj.y1 - pobj.y2))
  return [(pobj.x1 - pobj.x2) * r, (pobj.y1 - pobj.y2) * r]
}
const getAPostion = (b,x,y) => {
  let list = []
  let r =  Math.sqrt(x*x+y*y)
  for (let i = -6; i < 8; i+=2) {
    let x = r * Math.cos((b+i)  * Math.PI / 180)
    let y = r * Math.sin((b+i)  * Math.PI / 180)
    let xy = getStoot(x, y)
    list.push({
      x: xy[0],
      y: xy[1]
    })
  }
  databus.bullets2 = list
}
const foo = (x, y) => {
  let b1 = x / y
  let b = Math.atan2(y, x) * 180 / Math.PI
  if (b < 0) {
    b += 360
  }
  getAPostion(b,x,y)
}
const rightFormatMovePosition = (x, y) => {
  let rx = common.screenWidth - common.HAND_WIDTH - 40
  let ry = common.screenHeight - common.HAND_HEIGHT - 40
  let centerX = ~~(rx + common.HAND_WIDTH / 2)
  let centerY = ~~(ry + common.HAND_HEIGHT / 2)
  let pobj = {}
  pobj.x2 = 0
  pobj.x1 = x - centerX
  pobj.y2 = 0
  pobj.y1 = y - centerY


  tools.getRoteImg(pobj, databus.rightPositions)
  let r = databus.playerSpeed / Math.sqrt((pobj.x1 - pobj.x2) * (pobj.x1 - pobj.x2) + (pobj.y1 - pobj.y2) * (pobj.y1 - pobj.y2))
  databus.shootX = (pobj.x1 - pobj.x2) * r
  databus.shootY = (pobj.y1 - pobj.y2) * r
  foo(pobj.x1, pobj.y1)
}
export const handEvent = () => {
  databus.touchHandler = (e) => {
    for (let p of e.touches) {
      let x = p.clientX
      let y = p.clientY
      //
      if (leftHandCheck(x, y)) {

        databus.leftPositions.touchedx = x
        databus.leftPositions.touchedy = y
        databus.leftPositions.touched = true
      }
      if (rightHandCheck(x, y)) {
        databus.rightPositions.touchedx = x
        databus.rightPositions.touchedy = y
        databus.rightPositions.touched = true
      }
    }
  }
  wx.onTouchStart(databus.touchHandler)
  // canvas.addEventListener('touchmove', ().bind(this))
  databus.moveHandler = (e) => {
    // e.preventDefault()
    for (let p of e.touches) {
      let x = p.clientX
      let y = p.clientY
      let lleft = (x - databus.leftPositions.touchedx) * (x - databus.leftPositions.touchedx) + (y - databus.leftPositions.touchedy) * (y - databus.leftPositions.touchedy)
      let lright = (x - databus.rightPositions.touchedx) * (x - databus.rightPositions.touchedx) + (y - databus.rightPositions.touchedy) * (y - databus.rightPositions.touchedy)
      if (lleft < lright) {
        if (databus.leftPositions.touched) {
          console.log('点击了')
          leftFormatMovePosition(x, y)
        }

        let l = Math.pow(160 - x, 2) + Math.pow(common.screenHeight - common.HAND_WIDTH + 20 - y, 2)
        if (l < 3600) {
          // this.isInsite = true
        } else {
          // this.isInsite = false
        }
      } else {
        if (databus.rightPositions.touched) {
          rightFormatMovePosition(x, y)
        }
      }
    }
  }
  wx.onTouchMove(databus.moveHandler)
  canvas.addEventListener('touchend', ((e) => {
    for (let obj of e.changedTouches) {
      let x = obj.clientX
      let y = obj.clientY
      let lleft = (x - databus.leftPositions.touchedx) * (x - databus.leftPositions.touchedx) + (y - databus.leftPositions.touchedy) * (y - databus.leftPositions.touchedy)
      let lright = (x - databus.rightPositions.touchedx) * (x - databus.rightPositions.touchedx) + (y - databus.rightPositions.touchedy) * (y - databus.rightPositions.touchedy)
      if (lleft < lright) {
        databus.leftPositions.touched = false
        databus.isTransX = false
        databus.isTransY = false
        databus.moveX = 0
        databus.moveY = 0
      } else {
        databus.rightPositions.touched = false
      }
    }
  }).bind(this))
}