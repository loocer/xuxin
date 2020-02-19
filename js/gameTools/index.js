import Accelerate from './accelerate'
import { rnd } from '../utils/tools'
import {
  screenWidth,
  screenHeight
} from '../utils/common'
import DataBus from '../main/databus'
let databus = new DataBus()
export const create1=()=>{
  if(databus.frame==10){
      let accelerate = databus.pools.getItemByClass('accelerate', Accelerate)
      accelerate.init(rnd(0,screenWidth),rnd(0,screenHeight))
      databus.gameTools.add(accelerate)
  }
}