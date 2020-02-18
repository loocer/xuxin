import init from './init'
import runking from './runking'
import game from './game'
import gameover from './gameover'
import Databus from '../../main/databus'
let databus = new Databus()
let tempIndex = null
var event = null
export const work=(that)=>{
  if(databus.pageIndex!=tempIndex){
    event = databus.touchHandler
    databus.pageList = [new init(),new runking(),new game(),new gameover()]
    wx.offTouchStart(databus.touchHandler)
    wx.offTouchMove(databus.moveHandler)
    databus.pageList[databus.pageIndex].addEventLinner(that)
    tempIndex = databus.pageIndex
  }
  return databus.pageList[databus.pageIndex]
}