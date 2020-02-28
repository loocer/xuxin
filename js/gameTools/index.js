import Accelerate from './accelerate'
import Boom from './boom'
import Slow from './slow'
import {
  rnd
} from '../utils/tools'
import {
  screenWidth,
  screenHeight
} from '../utils/common'
import DataBus from '../main/databus'
let databus = new DataBus()
let slow = new Slow()
export const create1 = () => {
  if (databus.checkIndex > 1) {
    if (databus.frame % 600 == 0) {
      let accelerate = databus.pools.getItemByClass('accelerate', Accelerate)
      accelerate.init(rnd(screenWidth/2-100, screenWidth/2+100), rnd(screenWidth/2-180, screenWidth/2+180))
      databus.gameTools.add(accelerate)
    }
  }
  if (databus.checkIndex > 2) {
    if (databus.frame % 1000 == 0) {
      let boom = databus.pools.getItemByClass('boom', Boom)
      if (!boom.isBoom) {
        boom.init(rnd(screenWidth/2-200, screenWidth/2+100), rnd(screenWidth/2-10, screenWidth/2+80))
        databus.gameTools.add(boom)
      }
    }
  }
  if (databus.checkIndex>3 ) {
    if (databus.frame % 700 == 0) {
      if(!slow.visible){
        slow.init(rnd(screenWidth/2-200, screenWidth/2+100), rnd(screenWidth/2-10, screenWidth/2+80))
        databus.gameTools.add(slow)
      }
    }
  }
}