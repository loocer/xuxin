import init from './init'
import runking from './runking'
import game from './game'
import learn from './learn'
import gameover from './gameover'
import over from './over'
import Databus from '../../main/databus'
let databus = new Databus()
let tempIndex = null
var event = null
export const work = (that) => {
  if (databus.pageIndex != tempIndex) {
    event = databus.touchHandler
    databus.pageList = [
      [1, new init()],
      [0, new runking()],
      [0, new game()],
      [1, new gameover()],
      [1, new over()],
      [0, new learn()]
    ]
    wx.offTouchStart(databus.touchHandler)
    wx.offTouchMove(databus.moveHandler)
    databus.pageList[databus.pageIndex][1].addEventLinner(that)
    tempIndex = databus.pageIndex
    if (databus.pageList[databus.pageIndex][0]) {
      databus.banner.show()
    } else {
      databus.banner.hide()
    }
    if(tempIndex==0){
      wx.getStorage({
        key: 'isShowLearn',
        success (res) {
          databus.isShowLearn = res.data
        },
        fail(res){
          databus.isShowLearn = true
          console.log(res)
        }
      })
    }
  }
  return databus.pageList[databus.pageIndex][1]
}