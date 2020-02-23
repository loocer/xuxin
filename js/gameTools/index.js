import Accelerate from './accelerate'
import Boom from './boom'
import { rnd } from '../utils/tools'
import {
  screenWidth,
  screenHeight
} from '../utils/common'
import DataBus from '../main/databus'
let databus = new DataBus()
export const create1=()=>{
  if(databus.frame%300==0){
      let accelerate = databus.pools.getItemByClass('accelerate', Accelerate)
      accelerate.init(rnd(0,screenWidth-50),rnd(0,screenHeight-50))
      databus.gameTools.add(accelerate)
  }
  if(databus.frame%500==0){
    let boom = databus.pools.getItemByClass('boom', Boom)
    if(!boom.isBoom){
      boom.init(rnd(0, screenWidth-50), rnd(0, screenHeight-50))
      databus.gameTools.add(boom)
    }
  }
}